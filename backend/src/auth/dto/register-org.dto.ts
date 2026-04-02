import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterOrgDto {
  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase alphanumeric with hyphens only',
  })
  slug?: string;

  @IsString()
  @IsNotEmpty()
  adminName: string;

  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  adminPassword: string;
}
