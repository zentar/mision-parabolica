// Test setup file
import { jest } from '@jest/globals';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.SESSION_CODE_LENGTH = '6';
process.env.HINT_PENALTY = '1';
process.env.ALLOW_PARTIAL = 'true';
process.env.SYNC_INTERVAL_MS = '5000';


