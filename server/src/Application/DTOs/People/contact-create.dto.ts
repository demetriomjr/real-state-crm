import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsIn,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ContactCreateDto {
  @ApiProperty({
    description: "Contact name/label",
    example: "Work Email",
    required: false,
  })
  @IsOptional()
  @IsString()
  contact_name?: string;

  @ApiProperty({
    description: "Contact type",
    example: "email",
    enum: ["email", "phone", "cellphone"],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(["email", "phone", "cellphone"])
  contact_type: string;

  @ApiProperty({ description: "Contact value", example: "john@example.com" })
  @IsString()
  @IsNotEmpty()
  contact_value: string;

  @ApiProperty({
    description: "Is WhatsApp contact (only for phone/cellphone)",
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_whatsapp?: boolean;

  @ApiProperty({ description: "Person ID", example: "uuid-string" })
  @IsString()
  @IsNotEmpty()
  person_id: string;

  @ApiProperty({
    description: "Is default contact for this type",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
