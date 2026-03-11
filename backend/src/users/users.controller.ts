import { 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Delete, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    const data = await this.usersService.findAll();
    return { success: true, message: 'Users retrieved successfully', data };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findById(@Param('id') id: string) {
    const data = await this.usersService.findById(id);
    return { success: true, message: 'User retrieved successfully', data };
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    const data = await this.usersService.updateRole(id, role);
    return { success: true, message: 'User role updated successfully', data };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true, message: 'User deleted successfully' };
  }
}
