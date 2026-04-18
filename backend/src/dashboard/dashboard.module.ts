import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ComplaintsModule } from '../complaints/complaints.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [ComplaintsModule, OrganizationsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
