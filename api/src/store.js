import { EventEmitter } from 'events';
import { customAlphabet } from 'nanoid';
import { seedMissions, getFinalTargetForSet } from './tasks.js';

export const bus = new EventEmitter();
const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', Number(process.env.SESSION_CODE_LENGTH || 6));

// In-memory DB
const db = {
  sessions: new Map(), // code -> session
  teams: new Map(),    // teamId -> team
};

export function newCode() { return nano(); }

export function createSession(teacherName, params = {}) {
  const code = newCode();
  const defaultTimers = { m1: 600, m2: 600, m3: 600, final: 480 };
  const timers = params.timers || defaultTimers;
  
  // Obtener el conjunto de ecuaciones (por defecto 'basic')
  const equationSet = params.equationSet || 'basic';
  console.log('🔧 Creating session with equationSet:', equationSet, 'params:', params);
  
  const session = {
    code,
    teacherName,
    status: 'waiting', // waiting, active, finished
    sessionStarted: false,
    createdAt: Date.now(),
    // Mantener compatibilidad con sistema anterior
    timers: timers,
    // Nuevo sistema de tiempo
    currentMission: 'm1',
    totalTimeRemaining: 0, // Se inicializa cuando se inicia la sesión
    missionTimes: timers,
    rules: {
      allowPartial: params.allowPartial ?? (process.env.ALLOW_PARTIAL === 'true'),
      hintPenalty: Number(process.env.HINT_PENALTY || 1)
    },
    missions: seedMissions(equationSet),
    finalTarget: getFinalTargetForSet(equationSet),
    teams: [],
    events: []
  };
  db.sessions.set(code, session);
  // No iniciar timers hasta que se active la sesión
  bus.emit('session:update', code);
  return session;
}

export function joinTeam(code, teamName) {
  const session = db.sessions.get(code);
  if (!session) throw new Error('SESSION_NOT_FOUND');
  
  // No permitir unirse si la sesión ya ha comenzado
  if (session.sessionStarted) {
    throw new Error('SESSION_ALREADY_STARTED');
  }
  
  const id = code + ':' + (session.teams.length + 1);
  const team = {
    id, code, name: teamName,
    progress: {
      m1: { answers: {}, isCorrect: false, hints: 0, timeSec: 0, attempts: 0 },
      m2: { answers: {}, isCorrect: false, hints: 0, timeSec: 0, attempts: 0 },
      m3: { answers: {}, isCorrect: false, hints: 0, timeSec: 0, attempts: 0 },
      final: { equation: '', justification: '', isCorrect: false, timeSec: 0 }
    },
    score: 0
  };
  session.teams.push(team.id);
  db.teams.set(team.id, team);
  bus.emit('session:update', code);
  return team;
}

export function getSession(code) {
  return db.sessions.get(code);
}

export function getTeam(teamId) {
  return db.teams.get(teamId);
}

export function updateTeam(team) {
  db.teams.set(team.id, team);
  bus.emit('session:update', team.code);
}

export function getSessionState(code) {
  const s = db.sessions.get(code);
  if (!s) return null;
  const teams = s.teams.map(tid => db.teams.get(tid)).filter(Boolean);
  const scoreboard = teams.map(t => ({ id: t.id, name: t.name, score: t.score })).sort((a,b) => b.score - a.score);
  
  return { 
    code: s.code, 
    status: s.status, 
    // Nuevo sistema de tiempo
    currentMission: s.currentMission || 'm1',
    totalTimeRemaining: s.totalTimeRemaining || 0,
    missionTimes: s.missionTimes || s.timers || { m1: 600, m2: 600, m3: 600, final: 480 },
    // Mantener compatibilidad
    timers: s.timers || { m1: 600, m2: 600, m3: 600, final: 480 },
    rules: s.rules, 
    missions: s.missions.map(m => ({ 
      key: m.key, 
      name: m.name, 
      func: m.func, 
      description: m.description,
      hints: m.hints || []
    })), 
    finalTarget: s.finalTarget, 
    teams, 
    scoreboard 
  };
}

// Nuevo sistema de timers
const interval = Number(process.env.SYNC_INTERVAL_MS || 1000); // 1 segundo para mayor precisión
const activeTimers = new Map(); // Para evitar múltiples timers

export function tickSession(code) {
  // Limpiar timer existente si existe
  if (activeTimers.has(code)) {
    clearInterval(activeTimers.get(code));
  }
  
  const timer = setInterval(() => {
    const s = db.sessions.get(code);
    if (!s || s.status !== 'active') {
      clearInterval(timer);
      activeTimers.delete(code);
      return;
    }
    
    // Decrementar tiempo total
    if (s.totalTimeRemaining > 0) {
      s.totalTimeRemaining -= 1;
      
      // Si se agota el tiempo, pasar a la siguiente misión
      if (s.totalTimeRemaining <= 0) {
        console.log(`⏰ Tiempo agotado para misión ${s.currentMission}`);
        console.log(`📊 Estado antes de avanzar: currentMission=${s.currentMission}, totalTimeRemaining=${s.totalTimeRemaining}`);
        advanceToNextMission(s);
        console.log(`📊 Estado después de avanzar: currentMission=${s.currentMission}, totalTimeRemaining=${s.totalTimeRemaining}`);
      }
    }
    
    bus.emit('session:update', code);
    console.log(`🔄 Emitido session:update para código ${code}, currentMission=${s.currentMission}`);
  }, interval);
  
  activeTimers.set(code, timer);
}

function advanceToNextMission(session) {
  const missionOrder = ['m1', 'm2', 'm3', 'final'];
  const currentIndex = missionOrder.indexOf(session.currentMission);
  
  console.log(`🔄 Avanzando misión: ${session.currentMission} -> siguiente`);
  console.log(`📊 Estado actual: currentMission=${session.currentMission}, currentIndex=${currentIndex}`);
  
  if (currentIndex < missionOrder.length - 1) {
    // Marcar la misión actual como no superada por tiempo agotado
    const currentMissionKey = session.currentMission;
    
    // Pasar a la siguiente misión
    session.currentMission = missionOrder[currentIndex + 1];
    session.totalTimeRemaining = session.missionTimes[session.currentMission];
    
    console.log(`✅ Nueva misión: ${session.currentMission}, tiempo restante: ${session.totalTimeRemaining}`);
    console.log(`🔍 Verificación: session.currentMission = ${session.currentMission}, missionOrder[${currentIndex + 1}] = ${missionOrder[currentIndex + 1]}`);
    
    // Notificar a todos los equipos sobre el cambio de misión
    session.teams.forEach(teamId => {
      const team = db.teams.get(teamId);
      if (team) {
        // Marcar la misión anterior como no superada por tiempo agotado
        if (team.progress[currentMissionKey] && !team.progress[currentMissionKey].isCorrect) {
          team.progress[currentMissionKey].timeExpired = true;
          team.progress[currentMissionKey].status = 'time_expired';
        }
        
        // Desbloquear la nueva misión para todos los equipos
        bus.emit('mission:unlocked', { teamId, mission: session.currentMission });
      }
    });
  } else {
    // No hay más misiones, finalizar sesión
    // Pero primero marcar la fase final como no superada por tiempo agotado
    const currentMissionKey = session.currentMission;
    
    session.teams.forEach(teamId => {
      const team = db.teams.get(teamId);
      if (team) {
        // Marcar la fase final como no superada por tiempo agotado
        if (team.progress[currentMissionKey] && !team.progress[currentMissionKey].isCorrect) {
          team.progress[currentMissionKey].timeExpired = true;
          team.progress[currentMissionKey].status = 'time_expired';
        }
      }
    });
    
    session.status = 'finished';
    session.finishedAt = Date.now();
    
    // Limpiar el timer
    if (activeTimers.has(session.code)) {
      clearInterval(activeTimers.get(session.code));
      activeTimers.delete(session.code);
    }
  }
}

export function onMissionCompleted(teamId, missionKey) {
  const team = db.teams.get(teamId);
  if (!team) return;
  
  const session = db.sessions.get(team.code);
  if (!session || session.status !== 'active') return;
  
  // Si es la misión actual, avanzar a la siguiente
  if (missionKey === session.currentMission) {
    advanceToNextMission(session);
  }
}

// Session control functions
export function startSession(code) {
  const session = db.sessions.get(code);
  if (!session) return false;
  
  session.status = 'active';
  session.sessionStarted = true;
  session.startedAt = Date.now();
  
  // Inicializar el sistema de tiempo
  session.currentMission = 'm1';
  session.totalTimeRemaining = session.missionTimes.m1;
  
  // Iniciar el tick del timer
  tickSession(code);
  
  bus.emit('session:update', code);
  return true;
}

export function finishSession(code) {
  const session = db.sessions.get(code);
  if (!session) return false;
  
  session.status = 'finished';
  session.finishedAt = Date.now();
  
  // Limpiar el timer
  if (activeTimers.has(code)) {
    clearInterval(activeTimers.get(code));
    activeTimers.delete(code);
  }
  
  bus.emit('session:update', code);
  return true;
}

export function updateSessionTimers(code, newTimers) {
  const session = db.sessions.get(code);
  if (!session) return false;
  
  // Only allow timer updates if session hasn't started
  if (session.sessionStarted) return false;
  
  // Actualizar los tiempos de las misiones
  session.missionTimes = { ...session.missionTimes, ...newTimers };
  session.timers = { ...session.timers, ...newTimers }; // Mantener compatibilidad
  
  bus.emit('session:update', code);
  return true;
}
