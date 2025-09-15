import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ContactUpdateDto {
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

export class DocumentUpdateDto {
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

export class AddressUpdateDto {
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

export class UpdateUserDto {
  @ApiProperty({
    description: "Unique username",
    example: "johndoe",
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: "User password (already hashed - do not hash again)",
    example: "$2b$10$hashedpassword...",
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: "Full name of the person",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({
    description: "User level (1-10)",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  user_level?: number;

  @ApiProperty({
    description: "Tenant ID (UUID)",
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  @ApiProperty({
    description: "Person ID (UUID) - links user to person entity",
    example: "550e8400-e29b-41d4-a716-446655440001",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  person_id?: string;

  @ApiProperty({
    description: "Array of contacts to update",
    type: [ContactUpdateDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactUpdateDto)
  contacts?: ContactUpdateDto[];

  @ApiProperty({
    description: "Array of documents to update",
    type: [DocumentUpdateDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentUpdateDto)
  documents?: DocumentUpdateDto[];

  @ApiProperty({
    description: "Array of addresses to update",
    type: [AddressUpdateDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressUpdateDto)
  addresses?: AddressUpdateDto[];
}