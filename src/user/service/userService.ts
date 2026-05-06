import bcrypt from 'bcryptjs';
import { UserRepository } from '../repository/userRepository';
import { signJwt } from '../../auth/jwt';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { NotFoundError } from '../../error/notFoundError';
import { LoginRequestDto } from '../dto/auth.dto';
import { RoleName } from '../dto/role.dto';

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserRepository) private readonly repo: UserRepository) {}

  async signup(input: { email: string; password: string; organizationId: number; roleId: number }) {
    const org = await this.repo.findOrganizationById(input.organizationId);
    if (!org) return { ok: false as const, code: 400 as const, message: 'Invalid organizationId' };

    const existing = await this.repo.findUserByEmail(input.email);
    if (existing) return { ok: false as const, code: 409 as const, message: 'Email already registered' };

    if(input.roleId) {
    const role = await this.repo.findRoleById(input.roleId);
    if (!role) return { ok: false as const, code: 500 as const, message: 'Role not configured' };
    

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.repo.createUser({
      email: input.email,
      password: passwordHash,
      roleId: role.id,
      organizationId: input.organizationId,
    });

    const token = signJwt({
      sub: String(user.id),
      role: user.role.name as RoleName,
      organizationId: user.organizationId,
    });

      return { ok: true as const, token, user };
    }
    else {
      return { ok: false as const, code: 400 as const, message: 'Role not provided' };
    } 
  }

  async login(input: LoginRequestDto) {
    const user = await this.repo.findUserByEmail(input.email);
    if (!user) return { ok: false as const };
    if (!user.role.isActive) return { ok: false as const };

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) return { ok: false as const };

    const token = signJwt({
      sub: String(user.id),
      role: user.role.name as RoleName,
      organizationId: user.organizationId,
    });

    return {
      ok: true as const,
      token,
      user: {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  list(auth: { role: RoleName; organizationId?: number }) {
    if (auth.role === 'SUPER_ADMIN') return this.repo.listAll();
    return this.repo.listByOrganization(auth.organizationId!);
  }

  rolelist() {
    return this.repo.listrole();
  }

  async get(id: number) {
    const user = await this.repo.findPublicById(id);
    if (!user) throw new NotFoundError();
    return user;
  }

}

