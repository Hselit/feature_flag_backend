import type { Request, Response } from 'express';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '../schema/organization.schema';
import { OrganizationService } from '../service/organizationService';
import { CustomError } from '../../error/customError';
import { NoDataFoundError } from '../../error/noDataFoundError';
import { BadRequestError } from '../../error/badRequestError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';

@injectable()
export class OrganizationController {
  constructor(@inject(TYPES.OrganizationService) private readonly service: OrganizationService) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = CreateOrganizationSchema.parse(req.body);
      const org = await this.service.create(body);
      return res.status(201).json(org);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  list = async (_req: Request, res: Response) => {
    try {
      const orgs = await this.service.list();
      if (orgs.length === 0) throw new NoDataFoundError();
      return res.json(orgs);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new BadRequestError('Invalid id');

      const org = await this.service.get(id);
      return res.json(org);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new BadRequestError('Invalid id');
      const body = UpdateOrganizationSchema.parse(req.body);

      const org = await this.service.update(id, body);
      return res.json(org);
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new BadRequestError('Invalid id');

      await this.service.delete(id);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof CustomError) return res.status(err.statusCode).json({ message: err.message });
      throw err;
    }
  };
}

