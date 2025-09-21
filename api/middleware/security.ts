import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,
      process.env.PRODUCTION_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
};

/**
 * Rate limiting configuration
 */
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: {
          message: 'Rate limit exceeded',
          statusCode: 429,
          retryAfter: Math.round(windowMs / 1000)
        }
      });
    }
  });
};

// General rate limit: 100 requests per 15 minutes
export const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again in 15 minutes.'
);

// Auth rate limit: 5 requests per 15 minutes
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many authentication attempts, please try again in 15 minutes.'
);

// API rate limit: 1000 requests per hour
export const apiRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  1000,
  'API rate limit exceeded, please try again in an hour.'
);

/**
 * Helmet security configuration
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

/**
 * Request sanitization middleware
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove any potential XSS attempts
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

/**
 * API Key validation middleware
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'API key required',
        statusCode: 401
      }
    });
  }

  // In production, validate against stored API keys
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (validApiKeys.length > 0 && !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid API key',
        statusCode: 401
      }
    });
  }

  next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
  });
  
  next();
};