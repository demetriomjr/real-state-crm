import { IsString, IsOptional, IsEnum, IsDate } from "class-validator";

export class WhatsappSessionUpdateDto {
  @IsOptional()
  @IsString()
  session_name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsEnum(["pending", "connected", "disconnected", "error"])
  status?: "pending" | "connected" | "disconnected" | "error";

  @IsOptional()
  @IsDate()
  last_activity_at?: Date;
}
