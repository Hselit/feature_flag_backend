import { z } from 'zod';

export const CreateFeatureFlagSchema = z.object({
  key: z.string().min(1),
  isEnabled: z.boolean().optional(),
});

export const UpdateFeatureFlagSchema = z.object({
  key: z.string().min(1).optional(),
  isEnabled: z.boolean().optional(),
});

export const CheckFeatureFlagSchema = z.object({
  key: z.string().min(1),
});

