import { prisma } from '../../prisma';
import { injectable } from 'inversify';

@injectable()
export class UserRepository {
  findRoleById(id: number) {
    return prisma.role.findUnique({ where: { id } });
  }

  findOrganizationById(id: number) {
    return prisma.organization.findUnique({ where: { id } });
  }

  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        roleId: true,
        role: { select: { name: true, isActive: true } },
        organizationId: true,
      },
    });
  }

  createUser(data: { email: string; password: string; roleId: number; organizationId: number }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true, isActive: true } },
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  listAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  listrole() {
    return prisma.role.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  listByOrganization(organizationId: number) {
    return prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  findPublicById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findInternalById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true, roleId: true, role: { select: { name: true } }, organizationId: true },
    });
  }

  update(id: number, data: { email?: string; password?: string; roleId?: number; organizationId?: number }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}

