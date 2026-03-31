import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { forbidden } from '../utils/errors';

export function requireRole(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw forbidden();
    }
    if (!roles.includes(req.user.role)) {
      throw forbidden(`This action requires one of: ${roles.join(', ')}`);
    }
    next();
  };
}
