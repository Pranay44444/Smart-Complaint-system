import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { UsersModule } from '../users/users.module';
import { ComplaintsModule } from '../complaints/complaints.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    UsersModule,
    ComplaintsModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsService, OrganizationsRepository],
})
export class OrganizationsModule {}
