import { prisma } from '../../prisma';
import { injectable } from 'inversify';

@injectable()
export class OrganizationRepository {
  create(name: string) {
    return prisma.organization.create({ data: { name } });
  }

  list() {
    return prisma.organization.findMany({ orderBy: { id: 'desc' } });
  }

  findById(id: number) {
    return prisma.organization.findUnique({ where: { id } });
  }

  update(id: number, data: { name?: string }) {
    return prisma.organization.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.organization.delete({ where: { id } });
  }
}

