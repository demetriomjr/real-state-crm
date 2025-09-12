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
    description: "Contact type",
    example: "email",
    enum: ["email", "phone", "whatsapp", "cellphone"],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(["email", "phone", "whatsapp", "cellphone"])
  contact_type: string;

  @ApiProperty({ description: "Contact value", example: "john@example.com" })
  @IsString()
  @IsNotEmpty()
  contact_value: string;

  @ApiProperty({ description: "Person ID", example: "uuid-string" })
  @IsString()
  @IsNotEmpty()
  person_id: string;

  @ApiProperty({
    description: "Is primary contact",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

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
