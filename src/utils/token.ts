import type { Request } from 'express';

/**
 * Extract token from cookies or headers (Express request)
 */
export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers['authorization'];
  const tokenHeader: string | undefined = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  const token: string | undefined | null =
    req.cookies?.['token'] ||
    tokenHeader?.replace(/^Bearer\s+/i, '') ||
    (typeof req.headers['x-access-token'] === 'string'
      ? req.headers['x-access-token']
      : undefined) ||
    null;

  return token ?? null;
};
