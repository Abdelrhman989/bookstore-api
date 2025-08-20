import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import logger from '../utils/logger';

// Classify different errors
const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid value ${err.value} for field ${err.path}`;
  return { message, statusCode: 400 };
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.message.match(/"([^"]*)"/)[1];
  const message = `Duplicate value: ${value}. Please use another value!`;
  return { message, statusCode: 400 };
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data. ${errors.join('. ')}`;
  return { message, statusCode: 400 };
};

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
  const message = `Data validation error: ${errors}`;
  return { message, statusCode: 400 };
};

const handleJWTError = () => {
  return { message: 'Invalid token. Please log in again!', statusCode: 401 };
};

const handleJWTExpiredError = () => {
  return { message: 'Token expired! Please log in again.', statusCode: 401 };
};

// Main error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  
  // Log the error
  logger.error(`${req.method} ${req.url} - ${err.statusCode || 500} - ${err.message}\n${err.stack}`);

  // Handle different error types
  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
  if (err instanceof ZodError) error = handleZodError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send response
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
}
