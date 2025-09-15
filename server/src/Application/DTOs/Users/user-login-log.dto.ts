import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateUserLoginLogDto {
  @ApiProperty({ description: "User ID" })
  @IsString()
  user_id: string;

  @ApiProperty({ description: "Tenant ID" })
  @IsString()
  tenant_id: string;

  @ApiProperty({ description: "IP Address", required: false })
  @IsOptional()
  @IsString()
  ip_address?: string;

  @ApiProperty({ description: "User Agent", required: false })
  @IsOptional()
  @IsString()
  user_agent?: string;

  @ApiProperty({ description: "Login success", default: true })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: "Failure reason", required: false })
  @IsOptional()
  @IsString()
  failure_reason?: string;
}

export class UserLoginLogResponseDto {
  @ApiProperty({ description: "Login log ID" })
  id: string;

  @ApiProperty({ description: "Login timestamp" })
  login_at: Date;

  @ApiProperty({ description: "IP Address", required: false })
  ip_address?: string;

  @ApiProperty({ description: "User Agent", required: false })
  user_agent?: string;

  @ApiProperty({ description: "Login success" })
  success: boolean;

  @ApiProperty({ description: "Failure reason", required: false })
  failure_reason?: string;

  // Note: user_id, tenant_id, and created_at removed for security reasons
}
