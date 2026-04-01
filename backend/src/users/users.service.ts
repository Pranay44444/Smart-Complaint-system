import { Injectable, NotFoundException } from '@nestjs/common';
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
}
