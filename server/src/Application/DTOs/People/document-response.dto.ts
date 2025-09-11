import { ApiProperty } from "@nestjs/swagger";

export class DocumentResponseDto {
  @ApiProperty({ description: "Document ID", example: "uuid-string" })
  id: string;

  @ApiProperty({
    description: "Document type",
    example: "cpf",
    enum: ["cpf", "cnpj", "rg", "passport", "driver_license"],
  })
  document_type: string;

  @ApiProperty({ description: "Document number", example: "12345678901" })
  document_number: string;

  @ApiProperty({ description: "Is primary document", example: true })
  is_primary: boolean;

  @ApiProperty({
    description: "Is default document for this type",
    example: true,
  })
  is_default: boolean;

  // Note: person_id and all audit fields (created_by, updated_by, deleted_by, timestamps) are concealed for security reasons
}
