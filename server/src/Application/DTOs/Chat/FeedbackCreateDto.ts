import { IsString, IsOptional, IsUUID, IsEnum, IsArray } from "class-validator";

export class FeedbackCreateDto {
  @IsUUID()
  chat_id: string;

  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsString()
  user_prompt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  message_ids?: string[];
}
