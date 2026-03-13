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
  async create(
    @Body() dto: CreateComplaintDto,
    @GetUser() user: { userId: string; role: Role },
  ) {
    const data = await this.complaintsService.create(dto, user.userId);
    return { success: true, message: 'Complaint created successfully', data };
  }

  @Get()
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  async findAll(@GetUser() user: { userId: string; role: Role }) {
    const data = await this.complaintsService.findAll(user);
    return { success: true, message: 'Complaints retrieved successfully', data };
  }

  @Get(':id')
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  async findById(
    @Param('id') id: string,
    @GetUser() user: { userId: string; role: Role },
  ) {
    const data = await this.complaintsService.findById(id, user);
    return { success: true, message: 'Complaint retrieved successfully', data };
  }

  @Patch(':id/assign')
  @Roles(Role.ADMIN)
  async assign(
    @Param('id') id: string,
    @Body('staffId') staffId: string,
    @GetUser() user: { userId: string; role: Role },
  ) {
    const data = await this.complaintsService.assign(id, staffId, user);
    return { success: true, message: 'Complaint assigned successfully', data };
  }

  @Patch(':id/status')
  @Roles(Role.STAFF)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ComplaintStatus,
    @GetUser() user: { userId: string; role: Role },
  ) {
    const data = await this.complaintsService.updateStatus(id, status, user);
    return { success: true, message: 'Status updated successfully', data };
  }

  @Patch(':id/close')
  @Roles(Role.ADMIN)
  async close(
    @Param('id') id: string,
    @GetUser() user: { userId: string; role: Role },
  ) {
    const data = await this.complaintsService.close(id, user);
    return { success: true, message: 'Complaint closed successfully', data };
  }
}
