import type { RoleName } from './role.dto';

export type SuperAdminLoginRequestDto = {
  username: string;
  password: string;
};

export type SignupRequestDto = {
  email: string;
  password: string;
  organizationId: number;
  role: Exclude<RoleName, 'SUPER_ADMIN'>;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

