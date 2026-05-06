import { prisma } from '../../prisma';
import { injectable } from 'inversify';

@injectable()
export class FeatureFlagRepository {
  create(data: { key: string; isEnabled: boolean; organizationId: number }) {
    return prisma.featureFlag.create({ data });
  }

  listByOrganization(organizationId: number) {
    return prisma.featureFlag.findMany({ where: { organizationId }, orderBy: { id: 'desc' } });
  }

  findByIdForOrganization(id: number, organizationId: number) {
    return prisma.featureFlag.findFirst({ where: { id, organizationId } });
  }

  update(id: number, data: { key?: string; isEnabled?: boolean }) {
    return prisma.featureFlag.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.featureFlag.delete({ where: { id } });
  }

  findByKeyForOrganization(key: string, organizationId: number) {
    return prisma.featureFlag.findUnique({ where: { key_organizationId: { key, organizationId } } });
  }
}

