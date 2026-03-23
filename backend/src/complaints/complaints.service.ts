import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ComplaintsRepository } from './complaints.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintStatus } from '../common/enums/complaint-status.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ComplaintsService {
  constructor(
    private readonly complaintsRepository: ComplaintsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  private async getNextStaff(): Promise<Types.ObjectId | null> {
    const staffList = await this.usersRepository.findAllByRole(Role.STAFF);
    if (!staffList || staffList.length === 0) return null;

    const totalComplaints = await this.complaintsRepository.countAll();
    const index = totalComplaints % staffList.length;
    return (staffList[index] as any)._id as Types.ObjectId;
  }

  async create(dto: CreateComplaintDto, userId: string) {
    const complaint = await this.complaintsRepository.create(dto, userId);

    const staffId = await this.getNextStaff();
    if (staffId) {
      // assignTo already sets status → ASSIGNED and assignedTo
      const updated = await this.complaintsRepository.assignTo(
        (complaint as any)._id.toString(),
        staffId.toString(),
      );
      return updated ?? complaint;
    }

    // Graceful fallback: no staff exists, complaint stays OPEN
    return complaint;
  }

  async findAll(user: { userId: string; role: Role }) {
    if (user.role === Role.ADMIN) {
      return this.complaintsRepository.findAll();
    }
    if (user.role === Role.STAFF) {
      return this.complaintsRepository.findByAssignee(user.userId);
    }
    // USER role — only own complaints
    return this.complaintsRepository.findByUser(user.userId);
  }

  async findById(id: string, user: { userId: string; role: Role }) {
    const complaint = await this.complaintsRepository.findById(id);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    if (user.role === Role.ADMIN) return complaint;

    const createdById = (complaint.createdBy as any)?._id?.toString()
      ?? complaint.createdBy?.toString();
    const assignedToId = (complaint.assignedTo as any)?._id?.toString()
      ?? complaint.assignedTo?.toString();

    if (
      user.role === Role.USER && createdById !== user.userId ||
      user.role === Role.STAFF && assignedToId !== user.userId
    ) {
      throw new ForbiddenException('Access to this complaint is denied');
    }

    return complaint;
  }

  async assign(id: string, staffId: string, adminUser: { userId: string; role: Role }) {
    if (adminUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can assign complaints');
    }

    const staffUser = await this.usersRepository.findById(staffId);
    if (!staffUser) {
      throw new NotFoundException(`Staff member with ID ${staffId} not found`);
    }
    if (staffUser.role !== Role.STAFF) {
      throw new ForbiddenException(`User ${staffId} is not a staff member`);
    }

    const complaint = await this.complaintsRepository.assignTo(id, staffId);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return complaint;
  }

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    staffUser: { userId: string; role: Role },
  ) {
    if (staffUser.role !== Role.STAFF) {
      throw new ForbiddenException('Only staff can update complaint status');
    }

    const allowedStatuses = [ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED];
    if (!allowedStatuses.includes(status)) {
      throw new ForbiddenException('Staff can only set status to IN_PROGRESS or RESOLVED');
    }

    const complaint = await this.complaintsRepository.findById(id);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    const assignedToId = (complaint.assignedTo as any)?._id?.toString()
      ?? complaint.assignedTo?.toString();

    if (assignedToId !== staffUser.userId) {
      throw new ForbiddenException('You can only update status of complaints assigned to you');
    }

    return this.complaintsRepository.updateStatus(id, status);
  }

  async close(id: string, adminUser: { userId: string; role: Role }) {
    if (adminUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can close complaints');
    }

    const complaint = await this.complaintsRepository.updateStatus(id, ComplaintStatus.CLOSED);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return complaint;
  }
}
