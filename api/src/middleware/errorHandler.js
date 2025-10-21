import { 
  AppError, 
  formatErrorResponse, 
  isOperationalError, 
  logError 
} from '../errors/index.js';

/**
 * Global error handler middleware for Fastify
 */
export async function errorHandler(error, request, reply) {
  // Log the error
  logError(error, {
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body
  });

  // Handle different types of errors
  if (error instanceof AppError) {
    // Operational errors - send to client
    const response = formatErrorResponse(error);
    return reply.status(error.statusCode).send(response);
  }

  // Handle Fastify validation errors
  if (error.validation) {
    const response = formatErrorResponse(new AppError(
      'Validation failed',
      400
    ));
    response.details = error.validation;
    return reply.status(400).send(response);
  }

  // Handle JSON parsing errors
  if (error.statusCode === 400 && error.code === 'FST_ERR_VALIDATION') {
    const response = formatErrorResponse(new AppError(
      'Invalid JSON format',
      400
    ));
    return reply.status(400).send(response);
  }

  // Handle database connection errors
  if (error.code === 'SQLITE_CANTOPEN' || error.code === 'SQLITE_BUSY') {
    const response = formatErrorResponse(new AppError(
      'Database temporarily unavailable',
      503
    ));
    return reply.status(503).send(response);
  }

  // Handle rate limiting errors
  if (error.statusCode === 429) {
    const response = formatErrorResponse(new AppError(
      'Too many requests',
      429
    ));
    return reply.status(429).send(response);
  }

  // Handle CORS errors
  if (error.code === 'FST_ERR_BAD_URL') {
    const response = formatErrorResponse(new AppError(
      'Invalid URL format',
      400
    ));
    return reply.status(400).send(response);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = isOperationalError(error) 
    ? error.message 
    : 'Internal server error';

  const response = formatErrorResponse(new AppError(message, statusCode));
  
  return reply.status(statusCode).send(response);
}

/**
 * 404 handler for unmatched routes
 */
export async function notFoundHandler(request, reply) {
  const response = formatErrorResponse(new AppError(
    `Route ${request.method} ${request.url} not found`,
    404
  ));
  
  return reply.status(404).send(response);
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(fn) {
  return async (request, reply) => {
    try {
      return await fn(request, reply);
    } catch (error) {
      return errorHandler(error, request, reply);
    }
  };
}

/**
 * Validation error handler
 */
export function handleValidationError(error, field = null) {
  if (error.name === 'ZodError') {
    const issues = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code
    }));
    
    return new AppError('Validation failed', 400, {
      details: issues,
      field
    });
  }
  
  return new AppError(error.message, 400, { field });
}

/**
 * Database error handler
 */
export function handleDatabaseError(error, operation = 'database operation') {
  console.error(`Database error during ${operation}:`, error);
  
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return new AppError('Resource already exists', 409);
  }
  
  if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return new AppError('Referenced resource not found', 400);
  }
  
  if (error.code === 'SQLITE_BUSY') {
    return new AppError('Database is busy, please try again', 503);
  }
  
  return new AppError(`Database error: ${error.message}`, 500);
}

/**
 * Math error handler
 */
export function handleMathError(error, expression = null) {
  console.error('Math error:', error);
  
  if (error.message.includes('Invalid expression')) {
    return new AppError('Invalid mathematical expression', 400, { expression });
  }
  
  if (error.message.includes('Division by zero')) {
    return new AppError('Division by zero is not allowed', 400, { expression });
  }
  
  return new AppError(`Mathematical error: ${error.message}`, 400, { expression });
}


