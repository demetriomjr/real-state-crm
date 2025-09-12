import { ApiProperty } from "@nestjs/swagger";

export class ContactResponseDto {
  @ApiProperty({ description: "Contact ID", example: "uuid-string" })
  id: string;

  @ApiProperty({
    description: "Contact type",
    example: "email",
    enum: ["email", "phone", "whatsapp", "cellphone"],
  })
  contact_type: string;

  @ApiProperty({ description: "Contact value", example: "john@example.com" })
  contact_value: string;

  @ApiProperty({ description: "Is primary contact", example: true })
  is_primary: boolean;

  @ApiProperty({
    description: "Is default contact for this type",
    example: true,
  })
  is_default: boolean;

  // Note: person_id and all audit fields (created_by, updated_by, deleted_by, timestamps) are concealed for security reasons
}
