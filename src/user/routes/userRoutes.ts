import { Router } from 'express';
import { authenticate } from '../../auth/authMiddleware';
import { UserController } from '../controller/userController';
import { container } from '../../inversify/container';
import { TYPES } from '../../inversify/types';

export const userRoutes = Router();
const controller = container.get<UserController>(TYPES.UserController);

userRoutes.post('/signup', controller.signup);
userRoutes.post('/login', controller.login);
userRoutes.get('/roles', controller.rolelist);

userRoutes.use(authenticate);

userRoutes.get('/', controller.list);
userRoutes.get('/:id', controller.get);