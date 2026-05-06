import { Container } from 'inversify';
import { TYPES } from './types';

import { UserRepository } from '../user/repository/userRepository';
import { UserService } from '../user/service/userService';
import { UserController } from '../user/controller/userController';

import { OrganizationRepository } from '../organization/repository/organizationRepository';
import { OrganizationService } from '../organization/service/organizationService';
import { OrganizationController } from '../organization/controller/organizationController';

import { FeatureFlagRepository } from '../feature/repository/featureFlagRepository';
import { FeatureFlagService } from '../feature/service/featureFlagService';
import { FeatureFlagController } from '../feature/controller/featureFlagController';

export const container = new Container({ defaultScope: 'Singleton' });

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);

container.bind<OrganizationRepository>(TYPES.OrganizationRepository).to(OrganizationRepository);
container.bind<OrganizationService>(TYPES.OrganizationService).to(OrganizationService);
container.bind<OrganizationController>(TYPES.OrganizationController).to(OrganizationController);

container.bind<FeatureFlagRepository>(TYPES.FeatureFlagRepository).to(FeatureFlagRepository);
container.bind<FeatureFlagService>(TYPES.FeatureFlagService).to(FeatureFlagService);
container.bind<FeatureFlagController>(TYPES.FeatureFlagController).to(FeatureFlagController);

