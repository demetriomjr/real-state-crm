import { ApiProperty } from "@nestjs/swagger";

export class ContactResponseDto {
  @ApiProperty({ description: "Contact ID", example: "uuid-string" })
  id: string;

  @ApiProperty({
    description: "Contact name/label",
    example: "Work Email",
    required: false,
  })
  contact_name?: string;

  @ApiProperty({
    description: "Contact type",
    example: "email",
    enum: ["email", "phone", "cellphone"],
  })
  contact_type: string;

  @ApiProperty({ description: "Contact value", example: "john@example.com" })
  contact_value: string;

  @ApiProperty({
    description: "Is WhatsApp contact (only for phone/cellphone)",
    example: false,
  })
  is_whatsapp: boolean;

  @ApiProperty({
    description: "Is default contact for this type",
    example: true,
  })
  is_default: boolean;

  // Note: person_id and all audit fields (created_by, updated_by, deleted_by, timestamps) are concealed for security reasons
}
