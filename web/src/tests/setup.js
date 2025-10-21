import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn()
  }))
}));

// Mock styled-components
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  createGlobalStyle: jest.fn(() => 'div')
}));

// Setup test environment
beforeEach(() => {
  fetch.mockClear();
});


