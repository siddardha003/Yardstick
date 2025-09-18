import { AuthRequest } from './auth';
import { Response, NextFunction } from 'express';

export const requireRole = (role: 'Admin' | 'Member') => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};
