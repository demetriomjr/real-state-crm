import { IsString, IsOptional, IsInt, Min, Max, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: "Unique username",
    example: "johndoe",
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: "User password (min 6 characters)",
    example: "password123",
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: "User level (1-10)",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  user_level?: number;

  @ApiProperty({
    description: "Tenant ID (UUID)",
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;
}
