export const TYPES = {
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),

  OrganizationRepository: Symbol.for('OrganizationRepository'),
  OrganizationService: Symbol.for('OrganizationService'),
  OrganizationController: Symbol.for('OrganizationController'),

  FeatureFlagRepository: Symbol.for('FeatureFlagRepository'),
  FeatureFlagService: Symbol.for('FeatureFlagService'),
  FeatureFlagController: Symbol.for('FeatureFlagController'),
} as const;

