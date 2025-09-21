import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware to handle 404 Not Found errors
 */
export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const message = `Route ${req.originalUrl} not found`;
  const error = new AppError(message, 404);
  next(error);
};