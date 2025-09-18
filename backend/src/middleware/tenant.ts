import { AuthRequest } from './auth';
import { Response, NextFunction } from 'express';

export const tenantMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.tenantId) {
    return res.status(403).json({ message: 'Tenant not found in token' });
  }
  // Optionally, set req.tenantId = req.user.tenantId for convenience
  next();
};
