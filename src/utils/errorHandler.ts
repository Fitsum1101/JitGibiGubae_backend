import type { Request, Response, NextFunction } from 'express';

import { ApiError } from './apiError';

interface JsonSyntaxError extends SyntaxError {
  type?: string;
  status?: number;
}

interface MongooseValidationError extends Error {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface MongooseDuplicateKeyError extends Error {
  code: 11000;
}

interface MongooseCastError extends Error {
  name: 'CastError';
}

/**
 * Handler for unknown routes
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'common.errors.route_not_found'));
};

/**
 * Centralized error handler
 */
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError) {
    const jsonError = err as JsonSyntaxError;
    if (jsonError.type === 'entity.parse.failed' && jsonError.status === 400) {
      return res.status(400).json({
        success: false,
        message: req.t('common.errors.invalid_json'),
        errors: [jsonError.message],
      });
    }
  }

  // Handle Mongoose validation errors
  if ((err as MongooseValidationError).name === 'ValidationError') {
    const validationErr = err as MongooseValidationError;
    const messages = Object.values(validationErr.errors).map((val) => val.message);
    err = new ApiError(400, 'common.errors.validation_error', messages);
  }

  // Handle Mongoose duplicate key errors
  if ((err as MongooseDuplicateKeyError).code === 11000) {
    err = new ApiError(400, 'common.errors.duplicate_key');
  }

  // Handle Mongoose cast errors
  if ((err as MongooseCastError).name === 'CastError') {
    err = new ApiError(404, 'common.errors.resource_not_found');
  }

  // Localization
  const apiErr = err as ApiError;
  const statusCode = apiErr.statusCode || 500;
  const localizedMessage =
    typeof apiErr.message === 'string'
      ? req.t(apiErr.message)
      : apiErr.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message: localizedMessage,
    errors: apiErr.errors || [],
  });
};
