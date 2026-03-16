import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('complaints/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  addComment(
    @Param('id') complaintId: string,
    @Body() dto: CreateCommentDto,
    @GetUser() user: { userId: string; role: Role },
  ) {
    return this.commentsService.addComment(complaintId, dto, user);
  }

  @Get()
  @Roles(Role.USER, Role.STAFF, Role.ADMIN)
  getComments(
    @Param('id') complaintId: string,
    @GetUser() user: { userId: string; role: Role },
  ) {
    return this.commentsService.getComments(complaintId, user);
  }
}
