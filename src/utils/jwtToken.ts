import jwt, { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET ??
  process.env.ACCESS_TOKEN_SECRET ??
  'development-secret') as Secret;
const JWT_ISSUER = process.env.JWT_ISSUER ?? 'local-dev';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE ?? 'backend';

export const signAccessToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  if (typeof decoded === 'string') {
    return { id: decoded };
  }

  return decoded;
};
