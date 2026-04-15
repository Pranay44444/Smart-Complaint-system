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

interface CallerUser {
  userId: string;
  role: Role;
  orgId: string | null;
}

@Injectable()
export class ComplaintsService {
  constructor(
    private readonly complaintsRepository: ComplaintsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  private async getNextStaff(orgId: string): Promise<Types.ObjectId | null> {
    const staffList = await this.usersRepository.findAllByRole(Role.STAFF, orgId);
    if (!staffList || staffList.length === 0) return null;

    const totalComplaints = await this.complaintsRepository.countAll(orgId);
    const index = totalComplaints % staffList.length;
    return (staffList[index] as any)._id as Types.ObjectId;
  }

  async create(dto: CreateComplaintDto, user: CallerUser) {
    if (!user.orgId) {
      throw new ForbiddenException('Only users belonging to an organization can create complaints');
    }

    const complaintData = { 
      ...dto, 
      orgId: new Types.ObjectId(user.orgId) 
    };
    const complaint = await this.complaintsRepository.create(complaintData as any, user.userId);

    const staffId = await this.getNextStaff(user.orgId);
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

  async findAll(user: CallerUser) {
    if (user.role === Role.ADMIN) {
      return this.complaintsRepository.findAll(user.orgId!);
    }
    if (user.role === Role.STAFF) {
      return this.complaintsRepository.findByAssignee(user.userId, user.orgId!);
    }
    // USER role — only own complaints
    return this.complaintsRepository.findByUser(user.userId, user.orgId!);
  }

  async findById(id: string, user: CallerUser) {
    const complaint = await this.complaintsRepository.findById(id);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    if (user.orgId && complaint.orgId.toString() !== user.orgId) {
      throw new ForbiddenException('Access to this complaint is denied');
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

  async assign(id: string, staffId: string, adminUser: CallerUser) {
    if (adminUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can assign complaints');
    }

    const currentComplaint = await this.complaintsRepository.findById(id);
    if (!currentComplaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    if (adminUser.orgId && currentComplaint.orgId.toString() !== adminUser.orgId) {
      throw new ForbiddenException('Access to this complaint is denied');
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
    staffUser: CallerUser,
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

    if (staffUser.orgId && complaint.orgId.toString() !== staffUser.orgId) {
      throw new ForbiddenException('Access to this complaint is denied');
    }

    const assignedToId = (complaint.assignedTo as any)?._id?.toString()
      ?? complaint.assignedTo?.toString();

    if (assignedToId !== staffUser.userId) {
      throw new ForbiddenException('You can only update status of complaints assigned to you');
    }

    return this.complaintsRepository.updateStatus(id, status);
  }

  async close(id: string, adminUser: CallerUser) {
    if (adminUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can close complaints');
    }

    const currentComplaint = await this.complaintsRepository.findById(id);
    if (!currentComplaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    if (adminUser.orgId && currentComplaint.orgId.toString() !== adminUser.orgId) {
      throw new ForbiddenException('Access to this complaint is denied');
    }

    const complaint = await this.complaintsRepository.updateStatus(id, ComplaintStatus.CLOSED);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return complaint;
  }
}
