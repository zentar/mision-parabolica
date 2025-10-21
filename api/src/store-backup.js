import { EventEmitter } from 'events';
import { customAlphabet } from 'nanoid';
import { seedMissions, finalTarget } from './tasks.js';

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
  const session = {
    code,
    teacherName,
    status: 'running',
    createdAt: Date.now(),
    timers: params.timers || { m1: 600, m2: 600, m3: 600, final: 480 },
    rules: {
      allowPartial: params.allowPartial ?? (process.env.ALLOW_PARTIAL === 'true'),
      hintPenalty: Number(process.env.HINT_PENALTY || 1)
    },
    missions: seedMissions(),
    finalTarget,
    teams: [],
    events: []
  };
  db.sessions.set(code, session);
  tickSession(code); // start timers
  bus.emit('session:update', code);
  return session;
}

export function joinTeam(code, teamName) {
  const session = db.sessions.get(code);
  if (!session) throw new Error('SESSION_NOT_FOUND');
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
  return { code: s.code, status: s.status, timers: s.timers, rules: s.rules, missions: s.missions.map(m => ({ key: m.key, name: m.name })), finalTarget: s.finalTarget.public, teams, scoreboard };
}

// Timers
const interval = Number(process.env.SYNC_INTERVAL_MS || 5000);
function tickSession(code) {
  const timer = setInterval(() => {
    const s = db.sessions.get(code);
    if (!s || s.status !== 'running') return clearInterval(timer);
    // naive timer consumption
    for (const key of ['m1','m2','m3','final']) {
      if (s.timers[key] > 0) s.timers[key] -= Math.floor(interval/1000);
    }
    bus.emit('session:update', code);
  }, interval);
}
