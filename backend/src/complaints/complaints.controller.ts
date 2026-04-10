import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintStatus } from '../common/enums/complaint-status.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles(Role.USER)
  create(
    @Body() dto: CreateComplaintDto,
    @GetUser() user: { userId: string; role: Role; orgId: string | null },
  ) {
    return this.complaintsService.create(dto, user);
  }

  @Get()
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  findAll(@GetUser() user: { userId: string; role: Role; orgId: string | null }) {
    return this.complaintsService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  findById(
    @Param('id') id: string,
    @GetUser() user: { userId: string; role: Role; orgId: string | null },
  ) {
    return this.complaintsService.findById(id, user);
  }

  @Patch(':id/assign')
  @Roles(Role.ADMIN)
  assign(
    @Param('id') id: string,
    @Body('staffId') staffId: string,
    @GetUser() user: { userId: string; role: Role; orgId: string | null },
  ) {
    return this.complaintsService.assign(id, staffId, user);
  }

  @Patch(':id/status')
  @Roles(Role.STAFF)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ComplaintStatus,
    @GetUser() user: { userId: string; role: Role; orgId: string | null },
  ) {
    return this.complaintsService.updateStatus(id, status, user);
  }

  @Patch(':id/close')
  @Roles(Role.ADMIN)
  close(
    @Param('id') id: string,
    @GetUser() user: { userId: string; role: Role; orgId: string | null },
  ) {
    return this.complaintsService.close(id, user);
  }
}
