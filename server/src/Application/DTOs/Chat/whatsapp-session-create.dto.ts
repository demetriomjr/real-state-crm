import { IsString, IsUUID } from "class-validator";

export class WhatsappSessionCreateDto {
  @IsUUID()
  tenant_id: string;

  @IsString()
  session_id: string;
}
