import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  getMyProfile(@GetUser() user: any) {
    return this.usersService.getMyProfile(user.userId);
  }

  @Patch('me')
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  updateMyProfile(@GetUser() user: any, @Body() dto: any) {
    return this.usersService.updateMyProfile(user.userId, dto);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.updateRole(id, role);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
