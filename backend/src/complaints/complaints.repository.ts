import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Complaint, ComplaintDocument } from './schemas/complaint.schema';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintStatus } from '../common/enums/complaint-status.enum';

@Injectable()
export class ComplaintsRepository {
  constructor(
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto, createdBy: string): Promise<Complaint> {
    const createdComplaint = new this.complaintModel({
      ...createComplaintDto,
      createdBy: new Types.ObjectId(createdBy),
    });
    return createdComplaint.save();
  }

  async findById(id: string): Promise<Complaint | null> {
    return this.complaintModel.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .exec();
  }

  async findAll(): Promise<Complaint[]> {
    return this.complaintModel.find()
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: string): Promise<Complaint[]> {
    return this.complaintModel.find({ createdBy: new Types.ObjectId(userId) })
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByAssignee(assigneeId: string): Promise<Complaint[]> {
    return this.complaintModel.find({ assignedTo: new Types.ObjectId(assigneeId) })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, status: ComplaintStatus): Promise<Complaint | null> {
    return this.complaintModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async assignTo(id: string, assigneeId: string): Promise<Complaint | null> {
    return this.complaintModel.findByIdAndUpdate(
      id, 
      { assignedTo: new Types.ObjectId(assigneeId), status: ComplaintStatus.ASSIGNED }, 
      { new: true }
    ).exec();
  }

  async save(complaint: ComplaintDocument): Promise<Complaint> {
    return complaint.save();
  }
}
