import rateLimit from '@fastify/rate-limit';
import helmet from 'helmet';

/**
 * Security middleware for Fastify
 */

/**
 * Rate limiting configuration
 */
export const rateLimitConfig = {
  global: {
    max: 100, // Maximum 100 requests
    timeWindow: '1 minute', // Per minute
    errorResponseBuilder: (request, context) => ({
      error: true,
      message: 'Rate limit exceeded',
      type: 'RATE_LIMIT',
      retryAfter: Math.round(context.after / 1000)
    })
  },
  
  sessions: {
    max: 10, // Maximum 10 session creations
    timeWindow: '5 minutes',
    errorResponseBuilder: (request, context) => ({
      error: true,
      message: 'Too many session creation attempts',
      type: 'RATE_LIMIT',
      retryAfter: Math.round(context.after / 1000)
    })
  },
  
  teams: {
    max: 20, // Maximum 20 team operations
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      error: true,
      message: 'Too many team operations',
      type: 'RATE_LIMIT',
      retryAfter: Math.round(context.after / 1000)
    })
  },
  
  submissions: {
    max: 50, // Maximum 50 submissions
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      error: true,
      message: 'Too many submission attempts',
      type: 'RATE_LIMIT',
      retryAfter: Math.round(context.after / 1000)
    })
  }
};

/**
 * Input sanitization middleware
 */
export async function sanitizeInput(request, reply) {
  // Sanitize string inputs
  if (request.body) {
    sanitizeObject(request.body);
  }
  
  if (request.query) {
    sanitizeObject(request.query);
  }
  
  if (request.params) {
    sanitizeObject(request.params);
  }
}

function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove potentially dangerous characters
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

/**
 * Session validation middleware
 */
export async function validateSession(request, reply) {
  const sessionCode = request.params.code || request.body?.code;
  
  if (!sessionCode) {
    return reply.code(400).send({
      error: true,
      message: 'Session code is required',
      type: 'VALIDATION_ERROR'
    });
  }
  
  // Validate session code format
  if (!/^[A-Z0-9]{6}$/.test(sessionCode)) {
    return reply.code(400).send({
      error: true,
      message: 'Invalid session code format',
      type: 'VALIDATION_ERROR'
    });
  }
}

/**
 * Team validation middleware
 */
export async function validateTeam(request, reply) {
  const teamId = request.params.teamId;
  
  if (!teamId) {
    return reply.code(400).send({
      error: true,
      message: 'Team ID is required',
      type: 'VALIDATION_ERROR'
    });
  }
  
  // Validate team ID format
  if (!/^[A-Z0-9]{6}:\d+$/.test(teamId)) {
    return reply.code(400).send({
      error: true,
      message: 'Invalid team ID format',
      type: 'VALIDATION_ERROR'
    });
  }
}

/**
 * Mission validation middleware
 */
export async function validateMission(request, reply) {
  const missionKey = request.params.missionKey;
  const validMissions = ['m1', 'm2', 'm3'];
  
  if (!missionKey || !validMissions.includes(missionKey)) {
    return reply.code(400).send({
      error: true,
      message: 'Invalid mission key',
      type: 'VALIDATION_ERROR'
    });
  }
}

/**
 * Content-Type validation middleware
 */
export async function validateContentType(request, reply) {
  if (request.method === 'POST' || request.method === 'PUT') {
    const contentType = request.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return reply.code(400).send({
        error: true,
        message: 'Content-Type must be application/json',
        type: 'VALIDATION_ERROR'
      });
    }
  }
}

/**
 * Request size validation middleware
 */
export async function validateRequestSize(request, reply) {
  const contentLength = request.headers['content-length'];
  const maxSize = 1024 * 1024; // 1MB
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return reply.code(413).send({
      error: true,
      message: 'Request entity too large',
      type: 'VALIDATION_ERROR'
    });
  }
}

/**
 * CORS security configuration
 */
export const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://mision-parabolica.vercel.app'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Rate-Limit', 'X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset']
};

/**
 * Security headers configuration
 */
export const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

/**
 * Input validation schemas
 */
export const validationSchemas = {
  sessionCode: {
    type: 'string',
    pattern: '^[A-Z0-9]{6}$',
    minLength: 6,
    maxLength: 6
  },
  
  teamName: {
    type: 'string',
    minLength: 1,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9\\s\\-_]+$'
  },
  
  teacherName: {
    type: 'string',
    minLength: 1,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9\\s\\-_]+$'
  },
  
  missionData: {
    type: 'object',
    properties: {
      vertex: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' }
        },
        required: ['x', 'y']
      },
      yIntercept: { type: 'number' },
      roots: {
        type: 'array',
        items: { type: 'number' },
        maxItems: 2
      },
      concavity: {
        type: 'string',
        enum: ['up', 'down']
      },
      axis: { type: 'number' },
      range: {
        type: 'array',
        items: { type: ['number', 'null'] },
        maxItems: 2
      }
    }
  },
  
  finalData: {
    type: 'object',
    properties: {
      equation: {
        type: 'string',
        minLength: 1,
        maxLength: 200
      },
      justification: {
        type: 'string',
        minLength: 1,
        maxLength: 1000
      }
    },
    required: ['equation', 'justification']
  }
};


