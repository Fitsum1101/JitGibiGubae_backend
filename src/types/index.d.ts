declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string | null;
        createdAt: Date;
        role?: string;
      };
    }
  }
}

export {};
