import { ApiProperty } from "@nestjs/swagger";

export class ContactResponseDto {
  @ApiProperty({ description: "Contact ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Contact type" })
  contact_type: string;

  @ApiProperty({ description: "Contact value" })
  contact_value: string;

  @ApiProperty({ description: "Contact name" })
  contact_name?: string;

  @ApiProperty({ description: "Is WhatsApp" })
  is_whatsapp?: boolean;

  @ApiProperty({ description: "Is default" })
  is_default: boolean;
}

export class DocumentResponseDto {
  @ApiProperty({ description: "Document ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Document type" })
  document_type: string;

  @ApiProperty({ description: "Document number" })
  document_number: string;

  @ApiProperty({ description: "Is default" })
  is_default: boolean;
}

export class AddressResponseDto {
  @ApiProperty({ description: "Address ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Street" })
  street: string;

  @ApiProperty({ description: "Number" })
  number?: string;

  @ApiProperty({ description: "City" })
  city: string;

  @ApiProperty({ description: "State" })
  state: string;

  @ApiProperty({ description: "Postal code" })
  postal_code: string;

  @ApiProperty({ description: "Country" })
  country: string;

  @ApiProperty({ description: "Is default" })
  is_default: boolean;
}

export class ChatResponseDto {
  @ApiProperty({ description: "Chat ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Contact name" })
  contact_name: string;

  @ApiProperty({ description: "Contact phone" })
  contact_phone: string;

  @ApiProperty({ description: "User observations" })
  user_observations?: string;

  @ApiProperty({ description: "Session ID" })
  session_id: string;

  @ApiProperty({ description: "Last message timestamp" })
  last_message_at: Date;

  // Person data embedded directly (person is a fragment, not a separate entity)
  @ApiProperty({ description: "Full name of the person" })
  full_name?: string;

  @ApiProperty({ description: "Primary document type" })
  document_type?: string;

  @ApiProperty({ description: "Primary document number" })
  document_number?: string;

  // Sub-tables
  @ApiProperty({
    description: "Additional contacts",
    type: [ContactResponseDto],
  })
  contacts?: ContactResponseDto[];

  @ApiProperty({
    description: "Additional documents",
    type: [DocumentResponseDto],
  })
  documents?: DocumentResponseDto[];

  @ApiProperty({
    description: "Additional addresses",
    type: [AddressResponseDto],
  })
  addresses?: AddressResponseDto[];

  // Note: person_id and all audit fields are concealed for security reasons
}
