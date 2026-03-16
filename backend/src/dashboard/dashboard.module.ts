import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ComplaintsModule } from '../complaints/complaints.module';

@Module({
  imports: [ComplaintsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
