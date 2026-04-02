import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('superadmin/orgs')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.organizationsService.suspend(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.organizationsService.activate(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.organizationsService.delete(id);
  }
}
