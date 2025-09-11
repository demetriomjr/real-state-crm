import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
} from "class-validator";

export class ChatCreateDto {
  @IsOptional()
  @IsUUID()
  person_id?: string;

  @IsString()
  session_id: string;

  @IsString()
  contact_name: string;

  @IsString()
  contact_phone: string;

  @IsOptional()
  @IsString()
  user_observations?: string;
}
