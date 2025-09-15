import { IsString, IsOptional, IsUUID, IsEnum } from "class-validator";

export class MessageCreateDto {
  @IsUUID()
  chat_id: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsString()
  message_id: string;

  @IsEnum(["received", "sent"])
  message_direction: "received" | "sent";

  @IsEnum(["text", "image", "audio", "video", "file"])
  message_type: "text" | "image" | "audio" | "video" | "file";

  @IsString()
  message_content: string;

  @IsOptional()
  @IsString()
  reply_to_message_id?: string;
}
