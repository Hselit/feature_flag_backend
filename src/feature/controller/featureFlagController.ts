import type { Request, Response } from 'express';
import { CheckFeatureFlagSchema, CreateFeatureFlagSchema, UpdateFeatureFlagSchema } from '../schema/featureFlag.schema';
import { FeatureFlagService } from '../service/featureFlagService';
import { CustomError } from '../../error/customError';
import { NoDataFoundError } from '../../error/noDataFoundError';
import { BadRequestError } from '../../error/badRequestError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';

@injectable()
export class FeatureFlagController {
  constructor(@inject(TYPES.FeatureFlagService) private readonly service: FeatureFlagService) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = CreateFeatureFlagSchema.parse(req.body);
      const organizationId = req.auth?.organizationId;
      if (!organizationId) throw new BadRequestError('Missing organization in token');

      const flag = await this.service.create(body, organizationId);
      return res.status(201).json(flag);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const organizationId = req.auth?.organizationId;
      if (!organizationId) throw new BadRequestError('Missing organization in token');

      const flags = await this.service.list(organizationId);
      if (flags.length === 0) throw new NoDataFoundError();
      return res.json(flags);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const organizationId = req.auth?.organizationId;
      if (!organizationId) throw new BadRequestError('Missing organization in token');

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new BadRequestError('Invalid id');

      const flag = await this.service.get(id, organizationId);
      return res.json(flag);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const organizationId = req.auth?.organizationId;
      if (!organizationId) throw new BadRequestError('Missing organization in token');

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new BadRequestError('Invalid id');

      const body = UpdateFeatureFlagSchema.parse(req.body);
      const flag = await this.service.update(id, body, organizationId);
      return res.json(flag);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const organizationId = req.auth?.organizationId;
      if (!organizationId) throw new BadRequestError('Missing organization in token');

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new BadRequestError('Invalid id');

      await this.service.delete(id, organizationId);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  check = async (req: Request, res: Response) => {
    try {
      const organizationId = req.auth?.organizationId;
      if (!organizationId) throw new BadRequestError('Missing organization in token');

      const q = req.query.key;
      const keyFromQuery = typeof q === 'string' ? q : Array.isArray(q) ? q[0] : undefined;
      const payload =
        keyFromQuery !== undefined ? { key: keyFromQuery } : (req.body as { key?: string });
      const body = CheckFeatureFlagSchema.parse(payload);
      const result = await this.service.check(body.key, organizationId);
      return res.json(result);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };
}

