import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessCreateDto {
  @ApiProperty({ description: 'Company name', example: 'Acme Corporation' })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty({ description: 'Subscription level (0-10)', example: 5, required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  subscription?: number;

  // Master User Information (required for business creation)
  @ApiProperty({ description: 'Master user full name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  master_user_fullName: string;

  @ApiProperty({ description: 'Master user username', example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  master_user_username: string;

  @ApiProperty({ description: 'Master user password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  master_user_password: string;
}
