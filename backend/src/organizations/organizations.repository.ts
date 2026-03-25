import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument, OrgPlan } from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const created = new this.organizationModel(dto);
    return created.save();
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizationModel.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.organizationModel.findOne({ slug }).exec();
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find().sort({ createdAt: -1 }).exec();
  }

  async updatePlan(id: string, plan: OrgPlan): Promise<Organization | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, { plan }, { new: true })
      .exec();
  }

  async setActive(id: string, isActive: boolean): Promise<Organization | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndDelete(id).exec();
  }
}
