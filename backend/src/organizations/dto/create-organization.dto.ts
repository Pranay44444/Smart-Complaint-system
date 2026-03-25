import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { OrgPlan } from '../schemas/organization.schema';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase alphanumeric with hyphens only',
  })
  slug?: string;

  @IsOptional()
  @IsEnum(OrgPlan)
  plan?: OrgPlan;
}
