import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterOrgDto } from './dto/register-org.dto';
import { RegisterWithOrgDto } from './dto/register-with-org.dto';
import { OrganizationsRepository } from '../organizations/organizations.repository';
import { Role } from '../common/enums/role.enum';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = (await this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    })) as UserDocument;

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async registerOrg(registerOrgDto: RegisterOrgDto) {
    const { orgName, adminName, adminEmail, adminPassword } = registerOrgDto;

    const existingUser = await this.usersRepository.findByEmail(adminEmail);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    let slug = registerOrgDto.slug;
    if (!slug) {
      slug = orgName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }

    const existingOrg = await this.organizationsRepository.findBySlug(slug);
    if (existingOrg) {
      throw new BadRequestException(`Organization with slug "${slug}" already exists`);
    }

    const org = await this.organizationsRepository.create({ name: orgName, slug });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const user = (await this.usersRepository.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      orgId: (org as any)._id as Types.ObjectId,
    } as any)) as UserDocument;

    const payload = { sub: user._id, email: user.email, role: user.role, orgId: user.orgId ?? null };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        sub: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
    };
  }

  async registerWithOrg(slug: string, dto: RegisterWithOrgDto) {
    const org = await this.organizationsRepository.findBySlug(slug);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    if (!(org as any).isActive) {
      throw new ForbiddenException('Organization is suspended');
    }

    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = (await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      role: Role.USER,
      orgId: (org as any)._id as Types.ObjectId,
    } as any)) as UserDocument;

    const payload = { sub: user._id, email: user.email, role: user.role, orgId: user.orgId ?? null };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.orgId) {
      const org = await this.organizationsRepository.findById(user.orgId.toString());
      if (!org) {
        throw new ForbiddenException('Organization no longer exists');
      }
      if (!org.isActive) {
        throw new ForbiddenException('Organization is suspended');
      }
    }

    const doc = user as UserDocument;
    const payload = { sub: doc._id, email: doc.email, role: doc.role, orgId: doc.orgId ?? null };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        sub: doc._id,
        name: doc.name,
        email: doc.email,
        role: doc.role,
      },
    };
  }
}
