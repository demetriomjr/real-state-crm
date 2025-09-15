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

export class PersonResponseDto {
  @ApiProperty({ description: "Person ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Full name" })
  full_name: string;

  @ApiProperty({ description: "Contacts", type: [ContactResponseDto] })
  contacts?: ContactResponseDto[];

  @ApiProperty({ description: "Documents", type: [DocumentResponseDto] })
  documents?: DocumentResponseDto[];

  @ApiProperty({ description: "Addresses", type: [AddressResponseDto] })
  addresses?: AddressResponseDto[];

  // Note: All audit fields (created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, person_id, tenant_id) are concealed for security reasons
}

export class UserResponseDto {
  @ApiProperty({ description: "User ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Unique username" })
  username: string;

  // Person data embedded directly (person is a fragment, not a separate entity)
  @ApiProperty({ description: "Full name of the person" })
  full_name: string;

  @ApiProperty({ description: "Contacts", type: [ContactResponseDto] })
  contacts?: ContactResponseDto[];

  @ApiProperty({ description: "Documents", type: [DocumentResponseDto] })
  documents?: DocumentResponseDto[];

  @ApiProperty({ description: "Addresses", type: [AddressResponseDto] })
  addresses?: AddressResponseDto[];

  // Note: person_id, user_level, tenant_id, password, and all audit fields are concealed for security reasons
}
