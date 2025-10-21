/**
 * Security configuration for Misión Parabólica API
 */

export const securityConfig = {
  // Rate limiting configuration
  rateLimits: {
    global: {
      max: 100,
      timeWindow: '1 minute',
      skipOnError: false
    },
    sessions: {
      max: 10,
      timeWindow: '5 minutes',
      skipOnError: false
    },
    teams: {
      max: 20,
      timeWindow: '1 minute',
      skipOnError: false
    },
    submissions: {
      max: 50,
      timeWindow: '1 minute',
      skipOnError: false
    }
  },

  // CORS configuration
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://mision-parabolica.vercel.app',
        'https://mision-parabolica.netlify.app'
      ];
      
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'X-API-Key'
    ],
    exposedHeaders: [
      'X-Rate-Limit', 
      'X-Rate-Limit-Remaining', 
      'X-Rate-Limit-Reset'
    ]
  },

  // Security headers
  headers: {
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
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: 'strict-origin-when-cross-origin'
  },

  // Input validation
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 10,
    maxObjectDepth: 5,
    allowedFileTypes: ['text/plain', 'application/json'],
    maxFileSize: 1024 * 1024, // 1MB
    maxRequestSize: 1024 * 1024 // 1MB
  },

  // Session security
  session: {
    maxSessionsPerIP: 5,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    codeLength: 6,
    codeRetries: 3,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Database security
  database: {
    maxConnections: 10,
    connectionTimeout: 30000,
    queryTimeout: 10000,
    enableForeignKeys: true,
    enableWAL: true
  },

  // Logging security
  logging: {
    logLevel: process.env.LOG_LEVEL || 'info',
    logSensitiveData: false,
    logIPAddresses: true,
    logUserAgents: true,
    logRequestBodies: false,
    logResponseBodies: false
  },

  // Environment-specific settings
  environment: {
    development: {
      rateLimits: {
        global: { max: 1000, timeWindow: '1 minute' }
      },
      cors: {
        origin: true // Allow all origins in development
      },
      logging: {
        logLevel: 'debug',
        logRequestBodies: true
      }
    },
    production: {
      rateLimits: {
        global: { max: 100, timeWindow: '1 minute' }
      },
      cors: {
        origin: (origin, callback) => {
          const allowedOrigins = [
            'https://mision-parabolica.vercel.app',
            'https://mision-parabolica.netlify.app'
          ];
          
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          
          return callback(new Error('Not allowed by CORS'), false);
        }
      },
      logging: {
        logLevel: 'warn',
        logRequestBodies: false
      }
    }
  }
};

/**
 * Get security configuration for current environment
 */
export function getSecurityConfig() {
  const env = process.env.NODE_ENV || 'development';
  const baseConfig = securityConfig;
  const envConfig = securityConfig.environment[env] || {};
  
  return {
    ...baseConfig,
    ...envConfig,
    environment: env
  };
}

/**
 * Validate security configuration
 */
export function validateSecurityConfig(config) {
  const errors = [];
  
  if (!config.rateLimits) {
    errors.push('Rate limits configuration is required');
  }
  
  if (!config.cors) {
    errors.push('CORS configuration is required');
  }
  
  if (!config.headers) {
    errors.push('Security headers configuration is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Security configuration validation failed: ${errors.join(', ')}`);
  }
  
  return true;
}


