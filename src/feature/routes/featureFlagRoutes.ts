import { Router } from 'express';
import { authenticate, requireRole } from '../../auth/authMiddleware';
import { FeatureFlagController } from '../controller/featureFlagController';
import { container } from '../../inversify/container';
import { TYPES } from '../../inversify/types';

export const featureFlagRoutes = Router();
const controller = container.get<FeatureFlagController>(TYPES.FeatureFlagController);

featureFlagRoutes.use(authenticate);

featureFlagRoutes.post('/', requireRole('ORG_ADMIN'), controller.create);
featureFlagRoutes.get('/', requireRole('ORG_ADMIN'), controller.list);
featureFlagRoutes.get('/check', requireRole('ORG_ADMIN', 'END_USER'), controller.check);
featureFlagRoutes.get('/:id', requireRole('ORG_ADMIN'), controller.get);
featureFlagRoutes.put('/:id', requireRole('ORG_ADMIN'), controller.update);
featureFlagRoutes.delete('/:id', requireRole('ORG_ADMIN'), controller.delete);

