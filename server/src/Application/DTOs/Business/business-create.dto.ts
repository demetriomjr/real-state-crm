import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ContactCreateDto {
  @ApiProperty({
    description: "Contact ID",
    example: "temp_123456789",
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: "Contact type", example: "email" })
  @IsString()
  contact_type: string;

  @ApiProperty({ description: "Contact value", example: "john@example.com" })
  @IsString()
  contact_value: string;

  @ApiProperty({
    description: "Is default contact",
    example: true,
    required: false,
  })
  @IsOptional()
  is_default?: boolean;
}

export class DocumentCreateDto {
  @ApiProperty({
    description: "Document ID",
    example: "temp_123456789",
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: "Document type", example: "cpf" })
  @IsString()
  document_type: string;

  @ApiProperty({ description: "Document number", example: "123.456.789-00" })
  @IsString()
  document_number: string;

  @ApiProperty({
    description: "Is default document",
    example: true,
    required: false,
  })
  @IsOptional()
  is_default?: boolean;
}

export class AddressCreateDto {
  @ApiProperty({
    description: "Address ID",
    example: "temp_123456789",
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: "Street address", example: "123 Main St" })
  @IsString()
  street: string;

  @ApiProperty({ description: "City", example: "São Paulo" })
  @IsString()
  city: string;

  @ApiProperty({ description: "State", example: "SP" })
  @IsString()
  state: string;

  @ApiProperty({ description: "Postal code", example: "01234-567" })
  @IsString()
  postal_code: string;

  @ApiProperty({ description: "Country", example: "Brazil" })
  @IsString()
  country: string;

  @ApiProperty({
    description: "Is default address",
    example: true,
    required: false,
  })
  @IsOptional()
  is_default?: boolean;
}

export class BusinessCreateDto {
  @ApiProperty({ description: "Company name", example: "Acme Corporation" })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty({
    description: "Subscription level (0-10)",
    example: 5,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  subscription?: number;

  // Master User Information (required for business creation)
  @ApiProperty({ description: "Master user full name", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  master_user_fullName: string;

  @ApiProperty({ description: "Master user username", example: "johndoe" })
  @IsString()
  @IsNotEmpty()
  master_user_username: string;

  @ApiProperty({ description: "Master user password", example: "password123" })
  @IsString()
  @IsNotEmpty()
  master_user_password: string;

  // Contact Information (will be created as contacts in person entity if provided)
  @ApiProperty({
    description: "Master user email",
    example: "john@example.com",
    required: false,
  })
  @IsOptional()
  @IsString()
  master_user_email?: string;

  @ApiProperty({
    description: "Master user phone",
    example: "+5511999999999",
    required: false,
  })
  @IsOptional()
  @IsString()
  master_user_phone?: string;

  // Additional contacts, documents, and addresses (optional)
  @ApiProperty({
    description: "Array of additional contacts",
    type: [ContactCreateDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactCreateDto)
  contacts?: ContactCreateDto[];

  @ApiProperty({
    description: "Array of additional documents",
    type: [DocumentCreateDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentCreateDto)
  documents?: DocumentCreateDto[];

  @ApiProperty({
    description: "Array of additional addresses",
    type: [AddressCreateDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressCreateDto)
  addresses?: AddressCreateDto[];
}
