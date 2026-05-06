import { OrganizationRepository } from '../repository/organizationRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { NotFoundError } from '../../error/notFoundError';
import type { OrganizationResponseDto } from '../dto/organization.dto';

@injectable()
export class OrganizationService {
  constructor(@inject(TYPES.OrganizationRepository) private readonly repo: OrganizationRepository) {}

  create(input: { name: string }): Promise<OrganizationResponseDto> {
    return this.repo.create(input.name) as Promise<OrganizationResponseDto>;
  }

  list(): Promise<OrganizationResponseDto[]> {
    return this.repo.list() as Promise<OrganizationResponseDto[]>;
  }

  async get(id: number): Promise<OrganizationResponseDto> {
    const org = await this.repo.findById(id);
    if (!org) throw new NotFoundError();
    return org as OrganizationResponseDto;
  }

  async update(id: number, data: { name?: string }): Promise<OrganizationResponseDto> {
    try {
      const org = await this.repo.update(id, data);
      return org as OrganizationResponseDto;
    } catch {
      throw new NotFoundError();
    }
  }

  async delete(id: number) {
    try {
      await this.repo.delete(id);
      return;
    } catch {
      throw new NotFoundError();
    }
  }
}

