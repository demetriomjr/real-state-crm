import { IsString, IsOptional, IsUUID } from "class-validator";

export class ChatCreateDto {
  @IsUUID()
  person_id: string;

  @IsString()
  contact_name: string;

  @IsString()
  contact_phone: string;

  @IsOptional()
  @IsString()
  user_observations?: string;

  @IsOptional()
  @IsString()
  session_id?: string;
}
