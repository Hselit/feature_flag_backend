import type { NextFunction, Request, Response } from 'express';
import { verifyJwt } from './jwt';
import type { RoleName } from '../user/dto/role.dto';

export type AuthUser = {
  role: RoleName;
  userId?: number;
  organizationId?: number;
};

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthUser;
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing Bearer token' });
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyJwt(token);
    req.auth = {
      role: payload.role,
      userId: payload.sub ? Number(payload.sub) : undefined,
      organizationId: payload.organizationId,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(...allowed: RoleName[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ message: 'Not authenticated' });
    if (!allowed.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
}

