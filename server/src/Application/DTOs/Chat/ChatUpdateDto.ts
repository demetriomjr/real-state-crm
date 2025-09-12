import { IsString, IsOptional, IsDate, IsUUID } from "class-validator";

export class ChatUpdateDto {
  @IsOptional()
  @IsUUID()
  person_id?: string;

  @IsOptional()
  @IsString()
  contact_name?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  user_observations?: string;

  @IsOptional()
  @IsDate()
  last_message_at?: Date;

  @IsOptional()
  @IsString()
  session_id?: string;
}
