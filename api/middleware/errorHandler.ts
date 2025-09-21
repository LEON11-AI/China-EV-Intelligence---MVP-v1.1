import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    stack?: string;
    details?: any;
  };
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    const message = err.message || 'Payment processing error';
    error = new AppError(message, 400);
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = new AppError(message, 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = new AppError(message, 400);
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later';
    error = new AppError(message, 429);
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    const message = 'Cross-origin request blocked';
    error = new AppError(message, 403);
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    const message = 'Database connection error';
    error = new AppError(message, 503);
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = {
      name: err.name,
      code: err.code,
      originalError: err,
    };
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper to catch async errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err: Error, promise) => {
  console.error('Unhandled Promise Rejection:', {
    error: err.message,
    stack: err.stack,
    promise,
    timestamp: new Date().toISOString(),
  });
  
  // Close server & exit process
  process.exit(1);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
  
  // Close server & exit process
  process.exit(1);
});