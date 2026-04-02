import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async create(dto: CreateOrganizationDto) {
    const slug = dto.slug ?? this.generateSlug(dto.name);

    const existing = await this.organizationsRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`Organization with slug "${slug}" already exists`);
    }

    return this.organizationsRepository.create({ ...dto, slug });
  }

  async findAll() {
    return this.organizationsRepository.findAll();
  }

  async findById(id: string) {
    const org = await this.organizationsRepository.findById(id);
    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }

  async suspend(id: string) {
    const org = await this.organizationsRepository.setActive(id, false);
    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }

  async activate(id: string) {
    const org = await this.organizationsRepository.setActive(id, true);
    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }

  async delete(id: string) {
    const org = await this.organizationsRepository.delete(id);
    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }
}
