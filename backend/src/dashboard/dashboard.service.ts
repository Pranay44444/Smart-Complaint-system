import { Injectable } from '@nestjs/common';
import { ComplaintsRepository } from '../complaints/complaints.repository';
import { ComplaintStatus } from '../common/enums/complaint-status.enum';

interface CallerUser {
  userId: string;
  role: string;
  orgId: string | null;
}

@Injectable()
export class DashboardService {
  constructor(private readonly complaintsRepository: ComplaintsRepository) {}

  async getSummary(callerUser: CallerUser) {
    const statusCounts = await this.complaintsRepository.countByStatus(callerUser.orgId!);

    // Build a full map with zeroes for any status not yet present
    const statusMap: Record<string, number> = {
      [ComplaintStatus.OPEN]: 0,
      [ComplaintStatus.ASSIGNED]: 0,
      [ComplaintStatus.IN_PROGRESS]: 0,
      [ComplaintStatus.RESOLVED]: 0,
      [ComplaintStatus.CLOSED]: 0,
    };

    for (const item of statusCounts) {
      statusMap[item._id] = item.count;
    }

    const total = Object.values(statusMap).reduce((sum, n) => sum + n, 0);

    return { total, byStatus: statusMap };
  }

  async getStaffPerformance(callerUser: CallerUser) {
    return this.complaintsRepository.resolvedPerStaff(callerUser.orgId!);
  }
}
