import { IsString, IsBoolean, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ContactUpdateDto {
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
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["email", "phone", "cellphone"])
  contact_type?: string;

  @ApiProperty({
    description: "Contact value",
    example: "john@example.com",
    required: false,
  })
  @IsOptional()
  @IsString()
  contact_value?: string;

  @ApiProperty({
    description: "Is WhatsApp contact (only for phone/cellphone)",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_whatsapp?: boolean;

  @ApiProperty({
    description: "Is default contact for this type",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
