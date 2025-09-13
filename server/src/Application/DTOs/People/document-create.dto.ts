import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsIn,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DocumentCreateDto {
  @ApiProperty({
    description: "Document type",
    example: "cpf",
    enum: ["cpf", "cnpj", "rg", "passport", "driver_license"],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(["cpf", "cnpj", "rg", "passport", "driver_license"])
  document_type: string;

  @ApiProperty({ description: "Document number", example: "12345678901" })
  @IsString()
  @IsNotEmpty()
  document_number: string;

  @ApiProperty({ description: "Person ID", example: "uuid-string" })
  @IsString()
  @IsNotEmpty()
  person_id: string;

  @ApiProperty({
    description: "Is primary document",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Is default document for this type",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
