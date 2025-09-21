/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public code?: string | number | undefined;
  public keyValue?: Record<string, any> | undefined;
  public errors?: Record<string, any> | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string | number,
    keyValue?: Record<string, any>
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    this.keyValue = keyValue;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error
   */
  static validation(message: string, errors?: Record<string, any>): AppError {
    const error = new AppError(message, 400);
    error.errors = errors;
    return error;
  }

  /**
   * Create an authentication error
   */
  static authentication(message: string = 'Authentication failed'): AppError {
    return new AppError(message, 401);
  }

  /**
   * Create an authorization error
   */
  static authorization(message: string = 'Access denied'): AppError {
    return new AppError(message, 403);
  }

  /**
   * Create a not found error
   */
  static notFound(resource: string = 'Resource'): AppError {
    return new AppError(`${resource} not found`, 404);
  }

  /**
   * Create a conflict error
   */
  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  /**
   * Create a rate limit error
   */
  static rateLimit(message: string = 'Too many requests'): AppError {
    return new AppError(message, 429);
  }

  /**
   * Create a payment required error
   */
  static paymentRequired(message: string = 'Payment required'): AppError {
    return new AppError(message, 402);
  }

  /**
   * Create an internal server error
   */
  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500);
  }

  /**
   * Create a service unavailable error
   */
  static serviceUnavailable(message: string = 'Service unavailable'): AppError {
    return new AppError(message, 503);
  }

  /**
   * Convert error to JSON
   */
  toJSON(): Record<string, any> {
    return {
      success: false,
      error: {
        message: this.message,
        statusCode: this.statusCode,
        status: this.status,
        code: this.code,
        errors: this.errors,
        keyValue: this.keyValue,
        ...(process.env.NODE_ENV === 'development' && {
          stack: this.stack,
        }),
      },
    };
  }
}