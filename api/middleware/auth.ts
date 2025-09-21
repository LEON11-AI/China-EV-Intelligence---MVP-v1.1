import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AppError } from '../utils/AppError';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AppError('Access token is required', 401);
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret is not configured', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Get user from database
    const user = await User.findById(decoded.userId).select('+password');
    
    if (!user) {
      throw new AppError('User not found or token is invalid', 401);
    }

    // Check if user account is locked
    if (user.isLocked()) {
      throw new AppError('Account is temporarily locked due to too many failed login attempts', 423);
    }

    // Check if email is verified (optional, based on requirements)
    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email address before accessing this resource', 403);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token has expired', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to authorize specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions to access this resource', 403));
    }

    next();
  };
};

/**
 * Middleware to check subscription access
 */
export const requireSubscription = (requiredPlan?: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const userPlan = req.user.subscription?.plan || 'free';
    const userStatus = req.user.subscription?.status || 'inactive';

    // Check if subscription is active
    if (userStatus !== 'active') {
      return next(new AppError('Active subscription required', 402));
    }

    // Check if user has required plan
    if (requiredPlan && !requiredPlan.includes(userPlan)) {
      return next(new AppError(`${requiredPlan.join(' or ')} subscription required`, 402));
    }

    next();
  };
};

/**
 * Middleware for optional authentication (doesn't throw error if no token)
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next(); // Continue without authentication
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.userId);
    
    if (user && !user.isLocked() && user.isEmailVerified) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ignore authentication errors and continue
    next();
  }
};

/**
 * Middleware to check if user owns the resource
 */
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      return next(new AppError('Access denied: You can only access your own resources', 403));
    }

    next();
  };
};

/**
 * Utility function to generate JWT token
 */
export const generateToken = (user: IUser): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRES_IN || '15m';
  
  if (!jwtSecret) {
    throw new AppError('JWT secret is not configured', 500);
  }

  return (jwt.sign as any)(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: jwtExpire,
    }
  );
};

/**
 * Utility function to generate refresh token
 */
export const generateRefreshToken = (user: IUser): string => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  const jwtRefreshExpire = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  
  if (!jwtRefreshSecret) {
    throw new AppError('JWT refresh secret is not configured', 500);
  }

  return (jwt.sign as any)(
    {
      userId: user._id.toString(),
      email: user.email,
      type: 'refresh',
    },
    jwtRefreshSecret,
    {
      expiresIn: jwtRefreshExpire,
    }
  );
};

/**
 * Utility function to verify refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (!jwtRefreshSecret) {
    throw new AppError('JWT refresh secret is not configured', 500);
  }

  return jwt.verify(token, jwtRefreshSecret) as JwtPayload;
};