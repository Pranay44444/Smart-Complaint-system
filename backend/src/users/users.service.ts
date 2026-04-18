import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { Role } from '../common/enums/role.enum';

interface CallerUser {
  userId: string;
  email: string;
  role: string;
  orgId: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(callerUser: CallerUser) {
    return this.usersRepository.findAll(callerUser.orgId!);
  }

  async findAllByRole(role: Role, callerUser: CallerUser) {
    return this.usersRepository.findAllByRole(role, callerUser.orgId!);
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.usersRepository.updateRole(id, role);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async delete(id: string) {
    const user = await this.usersRepository.delete(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getMyProfile(userId: string) {
    const user = await this.usersRepository.findById(userId) as any;
    if (!user) throw new NotFoundException('User not found');
    return { _id: user._id, name: user.name, email: user.email, role: user.role };
  }

  async updateMyProfile(userId: string, dto: { name?: string; currentPassword?: string; newPassword?: string }) {
    const user = await this.usersRepository.findById(userId) as any;
    if (!user) throw new NotFoundException('User not found');

    const updates: Partial<{ name: string; password: string }> = {};
    if (dto.name?.trim()) updates.name = dto.name.trim();

    if (dto.newPassword) {
      if (!dto.currentPassword) throw new BadRequestException('Current password is required');
      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) throw new BadRequestException('Current password is incorrect');
      updates.password = await bcrypt.hash(dto.newPassword, 10);
    }

    if (Object.keys(updates).length === 0) return { _id: user._id, name: user.name, email: user.email, role: user.role };

    const updated = await this.usersRepository.updateProfile(userId, updates) as any;
    return { _id: updated._id, name: updated.name, email: updated.email, role: updated.role };
  }
}
