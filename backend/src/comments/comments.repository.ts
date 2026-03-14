import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(
    dto: CreateCommentDto,
    complaintId: string,
    authorId: string,
  ): Promise<Comment> {
    const comment = new this.commentModel({
      content: dto.content,
      complaint: new Types.ObjectId(complaintId),
      author: new Types.ObjectId(authorId),
    });
    return comment.save();
  }

  async findByComplaint(complaintId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ complaint: new Types.ObjectId(complaintId) })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 })
      .exec();
  }
}
