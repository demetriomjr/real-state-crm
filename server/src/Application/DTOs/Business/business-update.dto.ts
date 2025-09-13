import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
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

  @ApiProperty({ description: "Is default contact", example: true, required: false })
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

  @ApiProperty({ description: "Is default document", example: true, required: false })
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

  @ApiProperty({ description: "Is default address", example: true, required: false })
  @IsOptional()
  is_default?: boolean;
}

export class BusinessUpdateDto {
  @ApiProperty({
    description: "Company name",
    example: "Acme Corporation",
    required: false,
  })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiProperty({
    description: "Subscription level (0-10)",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  subscription?: number;

  @ApiProperty({
    description: "Full name of the person (master user)",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  full_name?: string;

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
