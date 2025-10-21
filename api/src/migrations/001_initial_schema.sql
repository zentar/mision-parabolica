-- Initial database schema for Misión Parabólica
-- This file contains the complete schema for the application

-- Sessions table
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
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  session_code TEXT NOT NULL,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  progress TEXT NOT NULL, -- JSON string
  created_at INTEGER NOT NULL,
  FOREIGN KEY (session_code) REFERENCES sessions(code) ON DELETE CASCADE
);

-- Events table for audit log
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_code TEXT NOT NULL,
  team_id TEXT,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON string
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (session_code) REFERENCES sessions(code) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_teams_session ON teams(session_code);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_code);
CREATE INDEX IF NOT EXISTS idx_events_team ON events(team_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);

-- Enable foreign keys
PRAGMA foreign_keys = ON;

