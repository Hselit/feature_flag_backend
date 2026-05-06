import { z } from 'zod';
import type { RoleName } from '../dto/role.dto';

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.custom<RoleName>((v) => v === 'SUPER_ADMIN' || v === 'ORG_ADMIN' || v === 'END_USER').optional(),
  organizationId: z.number().int().optional(),
});

