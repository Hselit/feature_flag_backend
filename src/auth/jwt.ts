import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { RoleName } from '../user/dto/role.dto';

const JwtPayloadSchema = z.object({
  sub: z.string().optional(),
  role: z.custom<RoleName>((v) => v === 'SUPER_ADMIN' || v === 'ORG_ADMIN' || v === 'END_USER'),
  organizationId: z.number().int().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing env: JWT_SECRET');
  return secret;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '12h' });
}

export function verifyJwt(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret());
  return JwtPayloadSchema.parse(decoded);
}

