import { FeatureFlagRepository } from '../repository/featureFlagRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { ConflictError } from '../../error/conflictError';
import { NotFoundError } from '../../error/notFoundError';
import type { FeatureFlagCheckResponseDto, FeatureFlagResponseDto } from '../dto/featureFlag.dto';

@injectable()
export class FeatureFlagService {
  constructor(@inject(TYPES.FeatureFlagRepository) private readonly repo: FeatureFlagRepository) {}

  async create(input: { key: string; isEnabled?: boolean }, organizationId: number): Promise<FeatureFlagResponseDto> {
    try {
      const flag = await this.repo.create({
        key: input.key,
        isEnabled: input.isEnabled ?? false,
        organizationId,
      });
      return flag as FeatureFlagResponseDto;
    } catch {
      throw new ConflictError('Feature key already exists for organization');
    }
  }

  list(organizationId: number): Promise<FeatureFlagResponseDto[]> {
    return this.repo.listByOrganization(organizationId) as Promise<FeatureFlagResponseDto[]>;
  }

  async get(id: number, organizationId: number): Promise<FeatureFlagResponseDto> {
    const flag = await this.repo.findByIdForOrganization(id, organizationId);
    if (!flag) throw new NotFoundError();
    return flag as FeatureFlagResponseDto;
  }

  async update(
    id: number,
    input: { key?: string; isEnabled?: boolean },
    organizationId: number,
  ): Promise<FeatureFlagResponseDto> {
    const existing = await this.repo.findByIdForOrganization(id, organizationId);
    if (!existing) throw new NotFoundError();

    try {
      const flag = await this.repo.update(id, input);
      return flag as FeatureFlagResponseDto;
    } catch {
      throw new ConflictError('Feature key already exists for organization');
    }
  }

  async delete(id: number, organizationId: number) {
    const existing = await this.repo.findByIdForOrganization(id, organizationId);
    if (!existing) throw new NotFoundError();
    await this.repo.delete(id);
    return;
  }

  async check(key: string, organizationId: number): Promise<FeatureFlagCheckResponseDto> {
    const flag = await this.repo.findByKeyForOrganization(key, organizationId);
    return { key, enabled: flag?.isEnabled ?? false };
  }
}

