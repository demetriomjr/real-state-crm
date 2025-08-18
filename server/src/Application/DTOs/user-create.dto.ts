import { IsString, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Unique username', example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password (min 6 characters)', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User level (1-10)', example: 5, required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  user_level?: number;

  @ApiProperty({ description: 'Tenant ID (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  tenant_id: string;
}
