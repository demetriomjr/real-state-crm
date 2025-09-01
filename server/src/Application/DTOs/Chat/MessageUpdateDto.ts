import { IsString, IsOptional, IsEnum } from "class-validator";

export class MessageUpdateDto {
  @IsOptional()
  @IsString()
  message_content?: string;

  @IsOptional()
  @IsEnum(["text", "image", "audio", "video", "file"])
  message_type?: "text" | "image" | "audio" | "video" | "file";
}
