import { IsString, IsBoolean, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DocumentUpdateDto {
  @ApiProperty({
    description: "Document type",
    example: "cpf",
    enum: ["cpf", "cnpj", "rg", "passport", "driver_license"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["cpf", "cnpj", "rg", "passport", "driver_license"])
  document_type?: string;

  @ApiProperty({
    description: "Document number",
    example: "12345678901",
    required: false,
  })
  @IsOptional()
  @IsString()
  document_number?: string;

  @ApiProperty({
    description: "Is primary document",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @ApiProperty({
    description: "Is default document for this type",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
