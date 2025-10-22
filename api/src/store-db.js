import { EventEmitter } from 'events';
import { customAlphabet } from 'nanoid';
import { seedMissions, getFinalTargetForSet } from './tasks.js';
import { db, sessionQueries, teamQueries, eventQueries } from './database/index.js';

export const bus = new EventEmitter();
const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', Number(process.env.SESSION_CODE_LENGTH || 6));

export function newCode() { 
  return nano(); 
}

export function createSession(teacherName, params = {}) {
  const code = newCode();
  const now = Date.now();
  
  // Obtener el conjunto de ecuaciones (por defecto 'basic')
  const equationSet = params.equationSet || 'basic';
  console.log('🔧 Creating session with equationSet:', equationSet, 'params:', params);
  
  const session = {
    code,
    teacherName,
    status: 'running',
    createdAt: now,
    timers: params.timers || { m1: 600, m2: 600, m3: 600, final: 480 },
    rules: {
      allowPartial: params.allowPartial ?? (process.env.ALLOW_PARTIAL === 'true'),
      hintPenalty: Number(process.env.HINT_PENALTY || 1)
    },
    missions: seedMissions(equationSet),
    finalTarget: getFinalTargetForSet(equationSet),
    teams: [],
    events: []
  };

  // Save to database
  try {
    sessionQueries.create.run(
      code,
      teacherName,
      'running',
      now,
      JSON.stringify(session.timers),
      JSON.stringify(session.rules),
      JSON.stringify(session.missions),
      JSON.stringify(session.finalTarget)
    );
    
    // Log session creation event
    eventQueries.create.run(code, null, 'session_created', JSON.stringify({ teacherName }), now);
    
    bus.emit('session:update', code);
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
}

export function joinTeam(code, teamName) {
  const session = getSession(code);
  if (!session) throw new Error('SESSION_NOT_FOUND');
  
  const teamId = code + ':' + (session.teams.length + 1);
  const now = Date.now();
  
  const team = {
    id: teamId,
    code,
    name: teamName,
    progress: {
      m1: { answers: {}, isCorrect: false, hints: 0, timeSec: 0, attempts: 0 },
      m2: { answers: {}, isCorrect: false, hints: 0, timeSec: 0, attempts: 0 },
      m3: { answers: {}, isCorrect: false, hints: 0, timeSec: 0, attempts: 0 },
      final: { equation: '', justification: '', isCorrect: false, timeSec: 0 }
    },
    score: 0
  };

  try {
    // Save team to database
    teamQueries.create.run(
      teamId,
      code,
      teamName,
      0,
      JSON.stringify(team.progress),
      now
    );
    
    // Log team join event
    eventQueries.create.run(code, teamId, 'team_joined', JSON.stringify({ teamName }), now);
    
    bus.emit('session:update', code);
    return team;
  } catch (error) {
    console.error('Error joining team:', error);
    throw new Error('Failed to join team');
  }
}

export function getSession(code) {
  try {
    const row = sessionQueries.getByCode.get(code);
    if (!row) return null;
    
    return {
      code: row.code,
      teacherName: row.teacher_name,
      status: row.status,
      createdAt: row.created_at,
      timers: JSON.parse(row.timers),
      rules: JSON.parse(row.rules),
      missions: JSON.parse(row.missions),
      finalTarget: JSON.parse(row.final_target),
      teams: getTeamsBySession(code),
      events: getEventsBySession(code)
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export function getTeam(teamId) {
  try {
    const row = teamQueries.getById.get(teamId);
    if (!row) return null;
    
    return {
      id: row.id,
      code: row.session_code,
      name: row.name,
      score: row.score,
      progress: JSON.parse(row.progress)
    };
  } catch (error) {
    console.error('Error getting team:', error);
    return null;
  }
}

export function updateTeam(team) {
  try {
    teamQueries.update.run(
      team.name,
      team.score,
      JSON.stringify(team.progress),
      team.id
    );
    
    // Log team update event
    eventQueries.create.run(team.code, team.id, 'team_updated', JSON.stringify({ 
      score: team.score,
      progress: team.progress 
    }), Date.now());
    
    bus.emit('session:update', team.code);
  } catch (error) {
    console.error('Error updating team:', error);
    throw new Error('Failed to update team');
  }
}

export function getSessionState(code) {
  const session = getSession(code);
  if (!session) return null;
  
  const teams = getTeamsBySession(code);
  const scoreboard = teams.map(t => ({ 
    id: t.id, 
    name: t.name, 
    score: t.score 
  })).sort((a, b) => b.score - a.score);
  
  return { 
    code: session.code, 
    status: session.status, 
    timers: session.timers, 
    rules: session.rules, 
    missions: session.missions.map(m => ({ key: m.key, name: m.name })), 
    finalTarget: session.finalTarget.public, 
    teams, 
    scoreboard 
  };
}

// Helper functions
function getTeamsBySession(code) {
  try {
    const rows = teamQueries.getBySession.all(code);
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      score: row.score,
      progress: JSON.parse(row.progress)
    }));
  } catch (error) {
    console.error('Error getting teams by session:', error);
    return [];
  }
}

function getEventsBySession(code) {
  try {
    const rows = eventQueries.getBySession.all(code);
    return rows.map(row => ({
      id: row.id,
      teamId: row.team_id,
      type: row.event_type,
      data: JSON.parse(row.event_data || '{}'),
      timestamp: row.timestamp
    }));
  } catch (error) {
    console.error('Error getting events by session:', error);
    return [];
  }
}

// Timers
const interval = Number(process.env.SYNC_INTERVAL_MS || 5000);
function tickSession(code) {
  const timer = setInterval(() => {
    const session = getSession(code);
    if (!session || session.status !== 'running') return clearInterval(timer);
    
    // Update timers in database
    const updatedTimers = { ...session.timers };
    for (const key of ['m1', 'm2', 'm3', 'final']) {
      if (updatedTimers[key] > 0) {
        updatedTimers[key] -= Math.floor(interval / 1000);
      }
    }
    
    try {
      sessionQueries.updateTimers.run(JSON.stringify(updatedTimers), code);
      bus.emit('session:update', code);
    } catch (error) {
      console.error('Error updating timers:', error);
    }
  }, interval);
}

// Export the tickSession function for use in index.js
export { tickSession };

