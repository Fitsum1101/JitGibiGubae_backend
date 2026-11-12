import type { Request } from "express";

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
