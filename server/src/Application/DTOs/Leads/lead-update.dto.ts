import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { AddressDto, ContactDto, DocumentDto } from "./lead-create.dto";

export class LeadUpdateDto {
  // Person data (optional for updates)
  @ApiProperty({ description: "Full name of the person", required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ description: "Primary document type", required: false })
  @IsOptional()
  @IsString()
  document_type?: string;

  @ApiProperty({ description: "Primary document number", required: false })
  @IsOptional()
  @IsString()
  document_number?: string;

  // Lead data (optional for updates)
  @ApiProperty({
    description: "Type of lead",
    enum: ["customer", "prospect"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["customer", "prospect"])
  lead_type?: string;

  @ApiProperty({
    description: "Status of the lead",
    enum: ["new", "contacted", "qualified", "won", "lost"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["new", "contacted", "qualified", "won", "lost"])
  lead_status?: string;

  @ApiProperty({
    description: "Temperature of the lead",
    enum: ["hot", "warm", "cold"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["hot", "warm", "cold"])
  lead_temperature?: string;

  @ApiProperty({
    description: "Origin of the lead",
    enum: ["website", "email", "phone", "whatsapp", "cellphone", "other"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["website", "email", "phone", "whatsapp", "cellphone", "other"])
  lead_origin?: string;

  @ApiProperty({ description: "Description of the lead", required: false })
  @IsOptional()
  @IsString()
  lead_description?: string;

  @ApiProperty({
    description: "Notes about the lead",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lead_notes?: string[];

  @ApiProperty({
    description: "ID of the user who first contacted this lead",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  first_contacted_by?: string;

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
