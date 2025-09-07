import { IsString, IsNumber, IsOptional, IsBoolean, IsObject, IsArray } from "class-validator";

export class WhatsappWebhookMediaDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  mimetype?: string;

  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsObject()
  s3?: {
    Bucket: string;
    Key: string;
  };

  @IsOptional()
  error?: any;
}

export class WhatsappWebhookLocationDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;
}

export class WhatsappWebhookReplyToDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  participant?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsObject()
  _data?: any;
}

export class WhatsappWebhookPayloadDto {
  @IsString()
  id: string;

  @IsNumber()
  timestamp: number;

  @IsString()
  from: string;

  @IsOptional()
  @IsBoolean()
  fromMe?: boolean;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  participant?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsBoolean()
  hasMedia?: boolean;

  @IsOptional()
  @IsObject()
  media?: WhatsappWebhookMediaDto;

  @IsOptional()
  @IsNumber()
  ack?: number;

  @IsOptional()
  @IsString()
  ackName?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsObject()
  location?: WhatsappWebhookLocationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vCards?: string[];

  @IsOptional()
  @IsObject()
  _data?: any;

  @IsOptional()
  @IsObject()
  replyTo?: WhatsappWebhookReplyToDto;
}

export class WhatsappWebhookMeDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  lid?: string;

  @IsString()
  pushName: string;
}

export class WhatsappWebhookEnvironmentDto {
  @IsString()
  version: string;

  @IsString()
  engine: string;

  @IsString()
  tier: string;

  @IsString()
  browser: string;
}

export class WhatsappWebhookMetadataDto {
  @IsOptional()
  @IsString()
  "user.id"?: string;

  @IsOptional()
  @IsString()
  "user.email"?: string;
}

export class WhatsappWebhookDto {
  @IsString()
  id: string;

  @IsNumber()
  timestamp: number;

  @IsString()
  session: string;

  @IsOptional()
  @IsObject()
  metadata?: WhatsappWebhookMetadataDto;

  @IsString()
  engine: string;

  @IsString()
  event: string;

  @IsObject()
  payload: WhatsappWebhookPayloadDto;

  @IsObject()
  me: WhatsappWebhookMeDto;

  @IsObject()
  environment: WhatsappWebhookEnvironmentDto;
}
