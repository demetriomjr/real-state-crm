import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
  IsUUID,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

// Sub-table DTOs for embedded use
export class AddressDto {
  @ApiProperty({ description: "Address ID (for updates)", required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: "First line of the address" })
  @IsString()
  address_line_1: string;

  @ApiProperty({ description: "Second line of the address (optional)" })
  @IsOptional()
  @IsString()
  address_line_2?: string;

  @ApiProperty({ description: "City name" })
  @IsString()
  city: string;

  @ApiProperty({ description: "State or province" })
  @IsString()
  state: string;

  @ApiProperty({ description: "Country name" })
  @IsString()
  country: string;

  @ApiProperty({ description: "ZIP or postal code" })
  @IsString()
  zip_code: string;

  @ApiProperty({ description: "District or neighborhood (optional)" })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ description: "Whether this is the default address" })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class ContactDto {
  @ApiProperty({ description: "Contact ID (for updates)", required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: "Type of contact",
    enum: ["email", "phone", "whatsapp", "cellphone"],
    example: "email",
  })
  @IsString()
  @IsIn(["email", "phone", "whatsapp", "cellphone"])
  contact_type: string;

  @ApiProperty({
    description: "Contact value (email address, phone number, etc.)",
  })
  @IsString()
  contact_value: string;

  @ApiProperty({ description: "Whether this is the default contact" })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class DocumentDto {
  @ApiProperty({ description: "Document ID (for updates)", required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: "Type of document",
    enum: [
      "cpf",
      "cnpj",
      "rg",
      "passport",
      "driver_license",
      "voter_id",
      "work_card",
      "other",
    ],
    example: "cpf",
  })
  @IsString()
  @IsIn([
    "cpf",
    "cnpj",
    "rg",
    "passport",
    "driver_license",
    "voter_id",
    "work_card",
    "other",
  ])
  document_type: string;

  @ApiProperty({ description: "Document number" })
  @IsString()
  document_number: string;

  @ApiProperty({ description: "Whether this is the default document" })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class LeadCreateDto {
  // Person data
  @ApiProperty({ description: "Full name of the person" })
  @IsString()
  full_name: string;

  @ApiProperty({
    description: "Primary document type",
    enum: [
      "cpf",
      "cnpj",
      "rg",
      "passport",
      "driver_license",
      "voter_id",
      "work_card",
      "other",
    ],
    example: "cpf",
  })
  @IsString()
  @IsIn([
    "cpf",
    "cnpj",
    "rg",
    "passport",
    "driver_license",
    "voter_id",
    "work_card",
    "other",
  ])
  document_type: string;

  @ApiProperty({ description: "Primary document number" })
  @IsString()
  document_number: string;

  // Lead data
  @ApiProperty({
    description: "Type of lead",
    enum: ["customer", "prospect"],
    example: "customer",
  })
  @IsString()
  @IsIn(["customer", "prospect"])
  lead_type: string;

  @ApiProperty({
    description: "Status of the lead",
    enum: ["new", "contacted", "qualified", "won", "lost"],
    example: "new",
  })
  @IsString()
  @IsIn(["new", "contacted", "qualified", "won", "lost"])
  lead_status: string;

  @ApiProperty({
    description: "Temperature of the lead",
    enum: ["hot", "warm", "cold"],
    example: "warm",
  })
  @IsString()
  @IsIn(["hot", "warm", "cold"])
  lead_temperature: string;

  @ApiProperty({
    description: "Origin of the lead",
    enum: ["website", "email", "phone", "whatsapp", "cellphone", "other"],
    example: "website",
  })
  @IsString()
  @IsIn(["website", "email", "phone", "whatsapp", "cellphone", "other"])
  lead_origin: string;

  @ApiProperty({ description: "Description of the lead" })
  @IsString()
  lead_description: string;

  @ApiProperty({ description: "Notes about the lead", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lead_notes?: string[];

  @ApiProperty({ description: "ID of the user who first contacted this lead" })
  @IsUUID()
  first_contacted_by: string;

  // Optional sub-tables
  @ApiProperty({
    description: "Additional addresses",
    type: [AddressDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @ApiProperty({
    description: "Additional contacts",
    type: [ContactDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @ApiProperty({
    description: "Additional documents",
    type: [DocumentDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  other_documents?: DocumentDto[];
}
