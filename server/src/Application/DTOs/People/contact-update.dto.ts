import { IsString, IsBoolean, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ContactUpdateDto {
  @ApiProperty({
    description: "Contact type",
    example: "email",
    enum: ["email", "phone", "whatsapp", "cellphone"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["email", "phone", "whatsapp", "cellphone"])
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
    description: "Is primary contact",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @ApiProperty({
    description: "Is default contact for this type",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
