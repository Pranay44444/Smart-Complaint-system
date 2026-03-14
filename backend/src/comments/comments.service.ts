import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { ComplaintsRepository } from '../complaints/complaints.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from '../common/enums/role.enum';

interface AuthUser {
  userId: string;
  role: Role;
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly complaintsRepository: ComplaintsRepository,
  ) {}

  private async validateAccess(complaintId: string, user: AuthUser) {
    const complaint = await this.complaintsRepository.findById(complaintId);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${complaintId} not found`);
    }

    if (user.role === Role.ADMIN) return complaint;

    const createdById =
      (complaint.createdBy as any)?._id?.toString() ??
      complaint.createdBy?.toString();

    const assignedToId =
      (complaint.assignedTo as any)?._id?.toString() ??
      complaint.assignedTo?.toString();

    if (user.role === Role.USER && createdById !== user.userId) {
      throw new ForbiddenException(
        'You can only comment on your own complaints',
      );
    }

    if (user.role === Role.STAFF && assignedToId !== user.userId) {
      throw new ForbiddenException(
        'You can only comment on complaints assigned to you',
      );
    }

    return complaint;
  }

  async addComment(
    complaintId: string,
    dto: CreateCommentDto,
    user: AuthUser,
  ) {
    await this.validateAccess(complaintId, user);
    return this.commentsRepository.create(dto, complaintId, user.userId);
  }

  async getComments(complaintId: string, user: AuthUser) {
    await this.validateAccess(complaintId, user);
    return this.commentsRepository.findByComplaint(complaintId);
  }
}
