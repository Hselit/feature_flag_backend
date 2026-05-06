import type { Request, Response } from 'express';

import { SignupSchema, LoginSchema } from '../schema/userAuth.schema';
import { UserService } from '../service/userService';
import { CustomError } from '../../error/customError';
import { NoDataFoundError } from '../../error/noDataFoundError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private readonly service: UserService) {}

  signup = async (req: Request, res: Response) => {
    try {
      const body = SignupSchema.parse(req.body);
      const result = await this.service.signup(body);
      if (!result.ok) return res.status(result.code).json({ message: result.message });
      return res.status(201).json({ token: result.token, user: result.user });
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const body = LoginSchema.parse(req.body);
      const result = await this.service.login(body);
      if (!result.ok) return res.status(401).json({ message: 'Invalid credentials' });
      return res.json({ token: result.token, user: result.user });
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const auth = req.auth;
      if (!auth) return res.status(401).json({ message: 'Not authenticated' });

      if (auth.role !== 'SUPER_ADMIN' && !auth.organizationId) {
        return res.status(400).json({ message: 'Missing organization in token' });
      }

      const users = await this.service.list({ role: auth.role, organizationId: auth.organizationId });
      if (users.length === 0) throw new NoDataFoundError();
      return res.json(users);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  rolelist = async (req: Request, res: Response) => {
    try {
      const roles = await this.service.rolelist();
      if (roles.length === 0) throw new NoDataFoundError();
      return res.json(roles);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

      const user = await this.service.get(id);

      const auth = req.auth;
      if (!auth) return res.status(401).json({ message: 'Not authenticated' });
      if (auth.role === 'SUPER_ADMIN') return res.json(user);
      if (!auth.organizationId) return res.status(400).json({ message: 'Missing organization in token' });
      if (user.organizationId !== auth.organizationId)
        return res.status(403).json({ message: 'Forbidden' });

      return res.json(user);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

}

