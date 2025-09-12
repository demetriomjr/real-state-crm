import { IsString, IsOptional, IsUUID } from "class-validator";

export class WhatsappSessionCreateDto {
  @IsUUID()
  tenant_id: string;

  @IsString()
  session_name: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}
