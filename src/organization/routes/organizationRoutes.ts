import { Router } from 'express';
import { authenticate, requireRole } from '../../auth/authMiddleware';
import { OrganizationController } from '../controller/organizationController';
import { container } from '../../inversify/container';
import { TYPES } from '../../inversify/types';

export const organizationRoutes = Router();
const controller = container.get<OrganizationController>(TYPES.OrganizationController);

organizationRoutes.get('/', controller.list);

organizationRoutes.use(authenticate);
organizationRoutes.use(requireRole('SUPER_ADMIN'));

organizationRoutes.post('/', controller.create);

organizationRoutes.get('/:id', controller.get);
organizationRoutes.put('/:id', controller.update);
organizationRoutes.delete('/:id', controller.delete);

