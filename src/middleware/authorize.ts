import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { AuthenticatedRequest } from '../types/authMiddleare';
import { ApiError } from '../utils/apiError';

export const authorize = (roles: string[] = []): RequestHandler => {
  return (req: AuthenticatedRequest, _res, next) => {
    const user = req.user;

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'common.errors.authentication_required'));
    }

    if (roles.length > 0 && !(user.role && roles.includes(user.role))) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'common.errors.forbidden'));
    }

    next();
  };
};
