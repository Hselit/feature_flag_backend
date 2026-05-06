export type UserRoleDto = {
  id: number;
  name: string;
};

export type UserResponseDto = {
  id: number;
  email: string;
  organizationId: number;
  roleId: number;
  role: UserRoleDto;
  createdAt: Date;
  updatedAt: Date;
};

