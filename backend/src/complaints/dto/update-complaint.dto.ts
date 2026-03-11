import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ComplaintStatus } from '../../common/enums/complaint-status.enum';

export class UpdateComplaintDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @IsMongoId()
  @IsOptional()
  assignedTo?: string;
}
