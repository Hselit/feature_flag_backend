import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  organizationId: z.number().int(),
  roleId: z.number().int(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UnifiedLoginSchema = LoginSchema;

