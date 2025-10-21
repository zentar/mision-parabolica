/**
 * Custom Error Classes for Misión Parabólica API
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400);
    this.field = field;
    this.type = 'VALIDATION_ERROR';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NOT_FOUND';
  }
}

export class SessionNotFoundError extends NotFoundError {
  constructor(code) {
    super(`Session with code ${code}`);
    this.code = code;
    this.type = 'SESSION_NOT_FOUND';
  }
}

export class TeamNotFoundError extends NotFoundError {
  constructor(teamId) {
    super(`Team with id ${teamId}`);
    this.teamId = teamId;
    this.type = 'TEAM_NOT_FOUND';
  }
}

export class MissionNotFoundError extends NotFoundError {
  constructor(missionKey) {
    super(`Mission ${missionKey}`);
    this.missionKey = missionKey;
    this.type = 'MISSION_NOT_FOUND';
  }
}

export class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(`Database error: ${message}`, 500);
    this.originalError = originalError;
    this.type = 'DATABASE_ERROR';
  }
}

export class MathError extends AppError {
  constructor(message, expression = null) {
    super(`Mathematical error: ${message}`, 400);
    this.expression = expression;
    this.type = 'MATH_ERROR';
  }
}

export class SessionError extends AppError {
  constructor(message, code = null) {
    super(`Session error: ${message}`, 400);
    this.code = code;
    this.type = 'SESSION_ERROR';
  }
}

export class TeamError extends AppError {
  constructor(message, teamId = null) {
    super(`Team error: ${message}`, 400);
    this.teamId = teamId;
    this.type = 'TEAM_ERROR';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    this.type = 'RATE_LIMIT';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.type = 'AUTHENTICATION_ERROR';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
    this.type = 'AUTHORIZATION_ERROR';
  }
}

/**
 * Error response formatter
 */
export function formatErrorResponse(error) {
  const response = {
    error: true,
    message: error.message,
    type: error.type || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  };

  // Add additional fields for specific error types
  if (error instanceof ValidationError && error.field) {
    response.field = error.field;
  }

  if (error instanceof SessionNotFoundError) {
    response.code = error.code;
  }

  if (error instanceof TeamNotFoundError) {
    response.teamId = error.teamId;
  }

  if (error instanceof MissionNotFoundError) {
    response.missionKey = error.missionKey;
  }

  if (error instanceof MathError && error.expression) {
    response.expression = error.expression;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return response;
}

/**
 * Check if error is operational (expected) or programming error
 */
export function isOperationalError(error) {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Log error with appropriate level
 */
export function logError(error, context = {}) {
  const logData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  };

  if (error instanceof AppError) {
    logData.statusCode = error.statusCode;
    logData.type = error.type;
    logData.isOperational = error.isOperational;
  }

  // Log to console (in production, this would go to a logging service)
  console.error('Error occurred:', JSON.stringify(logData, null, 2));
}


