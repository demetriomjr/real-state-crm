import { IsString, IsOptional, IsUUID, IsEnum, IsArray } from "class-validator";

export class FeedbackCreateDto {
  @IsUUID()
  chat_id: string;

  @IsUUID()
  user_id: string;

  @IsEnum(["positive", "negative", "neutral"])
  feedback_type: "positive" | "negative" | "neutral";

  @IsEnum(["user_prompt", "ai_suggestion"])
  generation_type: "user_prompt" | "ai_suggestion";

  @IsOptional()
  @IsString()
  user_prompt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  message_ids?: string[];

  @IsString()
  feedback_content: string;
}

export class FeedbackResponseDto {
  id: string;
  chat_id: string;
  user_id: string;
  feedback_type: "positive" | "negative" | "neutral";
  generation_type: "user_prompt" | "ai_suggestion";
  user_prompt?: string;
  feedback_content: string;
  created_at: Date;
  updated_at: Date;
}
