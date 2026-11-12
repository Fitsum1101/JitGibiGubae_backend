import type { Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '../config/db';
import type { AuthenticatedRequest } from '../types/authMiddleare';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/jwtToken';
import { extractToken } from '../utils/token';

const authenticate: RequestHandler = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          req.t?.('auth.access_denied_no_token') || 'Access denied, no token provided'
        )
      );
    }

    const decoded = verifyAccessToken(token) as { id: string | number };
    const userId = Number(decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, req.t?.('auth.user_not_found') || 'User not found')
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err);

    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, req.t?.('auth.auth_failed') || 'Authentication failed')
    );
  }
};

export default authenticate;
