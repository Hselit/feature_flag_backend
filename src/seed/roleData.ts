import { prisma } from '../prisma';
import type { RoleName } from '../user/dto/role.dto';

const REQUIRED_ROLES: RoleName[] = ['SUPER_ADMIN', 'ORG_ADMIN', 'END_USER'];

export async function seedRolesData() {
  await Promise.all(
    REQUIRED_ROLES.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, isActive: true },
      }),
    ),
  );
}

