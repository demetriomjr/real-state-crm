import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto, ContactDto, DocumentDto } from '../Leads/lead-create.dto';

export class CustomerCreateDto {
  // Person data
  @ApiProperty({ description: 'Full name of the person' })
  @IsString()
  full_name: string;

  @ApiProperty({ 
    description: 'Primary document type',
    enum: ['cpf', 'cnpj', 'rg', 'passport', 'driver_license', 'voter_id', 'work_card', 'other'],
    example: 'cpf'
  })
  @IsString()
  @IsIn(['cpf', 'cnpj', 'rg', 'passport', 'driver_license', 'voter_id', 'work_card', 'other'])
  document_type: string;

  @ApiProperty({ description: 'Primary document number' })
  @IsString()
  document_number: string;

  // Customer data
  @ApiProperty({ 
    description: 'Type of customer', 
    enum: ['individual', 'company'],
    example: 'individual'
  })
  @IsString()
  @IsIn(['individual', 'company'])
  customer_type: string;

  @ApiProperty({ 
    description: 'Status of the customer', 
    enum: ['active', 'inactive'],
    example: 'active'
  })
  @IsString()
  @IsIn(['active', 'inactive'])
  customer_status: string;

  @ApiProperty({ description: 'ID of the user who fidelized this customer', required: false })
  @IsOptional()
  @IsUUID()
  fidelized_by?: string;

  // Optional sub-tables
  @ApiProperty({ description: 'Additional addresses', type: [AddressDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @ApiProperty({ description: 'Additional contacts', type: [ContactDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @ApiProperty({ description: 'Additional documents', type: [DocumentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  other_documents?: DocumentDto[];
}
