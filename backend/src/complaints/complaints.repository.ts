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

  async findAll(orgId: string): Promise<Complaint[]> {
    return this.complaintModel.find({ orgId: new Types.ObjectId(orgId) })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: string, orgId: string): Promise<Complaint[]> {
    return this.complaintModel.find({ createdBy: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId) })
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByAssignee(assigneeId: string, orgId: string): Promise<Complaint[]> {
    return this.complaintModel.find({ assignedTo: new Types.ObjectId(assigneeId), orgId: new Types.ObjectId(orgId) })
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

  async countAll(orgId: string): Promise<number> {
    return this.complaintModel.countDocuments({ orgId: new Types.ObjectId(orgId) }).exec();
  }

  async countByStatus(): Promise<{ _id: string; count: number }[]> {
    return this.complaintModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }

  async resolvedPerStaff(): Promise<{ staffId: string; staffName: string; staffEmail: string; count: number }[]> {
    return this.complaintModel.aggregate([
      {
        $match: {
          assignedTo: { $ne: null },
          status: { $in: [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED] },
        },
      },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'staff',
        },
      },
      { $unwind: '$staff' },
      {
        $project: {
          staffId: { $toString: '$_id' },
          staffName: '$staff.name',
          staffEmail: '$staff.email',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}
