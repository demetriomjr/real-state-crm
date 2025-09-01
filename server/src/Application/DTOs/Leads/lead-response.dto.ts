import { ApiProperty } from "@nestjs/swagger";

// Sub-table response DTOs
export class AddressResponseDto {
  @ApiProperty({ description: "Address ID" })
  id: string;

  @ApiProperty({ description: "First line of the address" })
  address_line_1: string;

  @ApiProperty({ description: "Second line of the address" })
  address_line_2?: string;

  @ApiProperty({ description: "City name" })
  city: string;

  @ApiProperty({ description: "State or province" })
  state: string;

  @ApiProperty({ description: "Country name" })
  country: string;

  @ApiProperty({ description: "ZIP or postal code" })
  zip_code: string;

  @ApiProperty({ description: "District or neighborhood" })
  district?: string;

  @ApiProperty({ description: "Whether this is the primary address" })
  is_primary: boolean;

  @ApiProperty({ description: "Creation timestamp" })
  created_at: Date;

  @ApiProperty({ description: "User who created this record", required: false })
  created_by?: string;

  @ApiProperty({ description: "Last update timestamp" })
  updated_at: Date;

  @ApiProperty({
    description: "User who last updated this record",
    required: false,
  })
  updated_by?: string;

  @ApiProperty({
    description: "Deletion timestamp (soft delete)",
    required: false,
  })
  deleted_at?: Date;

  @ApiProperty({ description: "User who deleted this record", required: false })
  deleted_by?: string;
}

export class ContactResponseDto {
  @ApiProperty({ description: "Contact ID" })
  id: string;

  @ApiProperty({ description: "Type of contact" })
  contact_type: string;

  @ApiProperty({ description: "Contact value" })
  contact_value: string;

  @ApiProperty({ description: "Whether this is the primary contact" })
  is_primary: boolean;

  @ApiProperty({ description: "Creation timestamp" })
  created_at: Date;

  @ApiProperty({ description: "User who created this record", required: false })
  created_by?: string;

  @ApiProperty({ description: "Last update timestamp" })
  updated_at: Date;

  @ApiProperty({
    description: "User who last updated this record",
    required: false,
  })
  updated_by?: string;

  @ApiProperty({
    description: "Deletion timestamp (soft delete)",
    required: false,
  })
  deleted_at?: Date;

  @ApiProperty({ description: "User who deleted this record", required: false })
  deleted_by?: string;
}

export class DocumentResponseDto {
  @ApiProperty({ description: "Document ID" })
  id: string;

  @ApiProperty({ description: "Type of document" })
  document_type: string;

  @ApiProperty({ description: "Document number" })
  document_number: string;

  @ApiProperty({ description: "Whether this is the primary document" })
  is_primary: boolean;

  @ApiProperty({ description: "Creation timestamp" })
  created_at: Date;

  @ApiProperty({ description: "User who created this record", required: false })
  created_by?: string;

  @ApiProperty({ description: "Last update timestamp" })
  updated_at: Date;

  @ApiProperty({
    description: "User who last updated this record",
    required: false,
  })
  updated_by?: string;

  @ApiProperty({
    description: "Deletion timestamp (soft delete)",
    required: false,
  })
  deleted_at?: Date;

  @ApiProperty({ description: "User who deleted this record", required: false })
  deleted_by?: string;
}

export class LeadResponseDto {
  // Lead data
  @ApiProperty({ description: "Lead ID" })
  id: string;

  @ApiProperty({ description: "Type of lead" })
  lead_type: string;

  @ApiProperty({ description: "Status of the lead" })
  lead_status: string;

  @ApiProperty({ description: "Temperature of the lead" })
  lead_temperature: string;

  @ApiProperty({ description: "Origin of the lead" })
  lead_origin: string;

  @ApiProperty({ description: "Description of the lead" })
  lead_description: string;

  @ApiProperty({ description: "Notes about the lead" })
  lead_notes: string[];

  @ApiProperty({ description: "ID of the user who first contacted this lead" })
  first_contacted_by: string;

  // Person data
  @ApiProperty({ description: "Person ID" })
  person_id: string;

  @ApiProperty({ description: "Full name of the person" })
  full_name: string;

  @ApiProperty({ description: "Primary document type" })
  document_type: string;

  @ApiProperty({ description: "Primary document number" })
  document_number: string;

  // Sub-tables
  @ApiProperty({
    description: "Additional addresses",
    type: [AddressResponseDto],
  })
  addresses: AddressResponseDto[];

  @ApiProperty({
    description: "Additional contacts",
    type: [ContactResponseDto],
  })
  contacts: ContactResponseDto[];

  @ApiProperty({
    description: "Additional documents",
    type: [DocumentResponseDto],
  })
  other_documents: DocumentResponseDto[];

  // Audit fields
  @ApiProperty({ description: "Creation timestamp" })
  created_at: Date;

  @ApiProperty({ description: "User who created this record", required: false })
  created_by?: string;

  @ApiProperty({ description: "Last update timestamp" })
  updated_at: Date;

  @ApiProperty({
    description: "User who last updated this record",
    required: false,
  })
  updated_by?: string;

  @ApiProperty({
    description: "Deletion timestamp (soft delete)",
    required: false,
  })
  deleted_at?: Date;

  @ApiProperty({ description: "User who deleted this record", required: false })
  deleted_by?: string;
}
