import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, '../../data/sessions.db');

// Create database instance
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Create sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      teacher_name TEXT NOT NULL,
      status TEXT DEFAULT 'running',
      created_at INTEGER NOT NULL,
      timers TEXT NOT NULL, -- JSON string
      rules TEXT NOT NULL,  -- JSON string
      missions TEXT NOT NULL, -- JSON string
      final_target TEXT NOT NULL -- JSON string
    )
  `);

  // Create teams table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      session_code TEXT NOT NULL,
      name TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      progress TEXT NOT NULL, -- JSON string
      created_at INTEGER NOT NULL,
      FOREIGN KEY (session_code) REFERENCES sessions(code) ON DELETE CASCADE
    )
  `);

  // Create events table for audit log
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_code TEXT NOT NULL,
      team_id TEXT,
      event_type TEXT NOT NULL,
      event_data TEXT, -- JSON string
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (session_code) REFERENCES sessions(code) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
    CREATE INDEX IF NOT EXISTS idx_teams_session ON teams(session_code);
    CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_code);
    CREATE INDEX IF NOT EXISTS idx_events_team ON events(team_id);
  `);
}

// Database operations
export const sessionQueries = {
  create: db.prepare(`
    INSERT INTO sessions (code, teacher_name, status, created_at, timers, rules, missions, final_target)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getByCode: db.prepare(`
    SELECT * FROM sessions WHERE code = ?
  `),
  
  updateStatus: db.prepare(`
    UPDATE sessions SET status = ? WHERE code = ?
  `),
  
  updateTimers: db.prepare(`
    UPDATE sessions SET timers = ? WHERE code = ?
  `),
  
  getAll: db.prepare(`
    SELECT * FROM sessions ORDER BY created_at DESC
  `)
};

export const teamQueries = {
  create: db.prepare(`
    INSERT INTO teams (id, session_code, name, score, progress, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  getById: db.prepare(`
    SELECT * FROM teams WHERE id = ?
  `),
  
  getBySession: db.prepare(`
    SELECT * FROM teams WHERE session_code = ? ORDER BY score DESC
  `),
  
  update: db.prepare(`
    UPDATE teams SET name = ?, score = ?, progress = ? WHERE id = ?
  `),
  
  delete: db.prepare(`
    DELETE FROM teams WHERE id = ?
  `)
};

export const eventQueries = {
  create: db.prepare(`
    INSERT INTO events (session_code, team_id, event_type, event_data, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  getBySession: db.prepare(`
    SELECT * FROM events WHERE session_code = ? ORDER BY timestamp DESC
  `),
  
  getByTeam: db.prepare(`
    SELECT * FROM events WHERE team_id = ? ORDER BY timestamp DESC
  `)
};

// Initialize database on import
initializeDatabase();

