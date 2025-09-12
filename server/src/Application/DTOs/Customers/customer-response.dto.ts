import { ApiProperty } from "@nestjs/swagger";
import {
  AddressResponseDto,
  ContactResponseDto,
  DocumentResponseDto,
} from "../Leads/lead-response.dto";

export class CustomerResponseDto {
  // Customer data
  @ApiProperty({ description: "Customer ID" })
  id: string;

  @ApiProperty({ description: "Type of customer" })
  customer_type: string;

  @ApiProperty({ description: "Status of the customer" })
  customer_status: string;

  @ApiProperty({ description: "ID of the user who fidelized this customer" })
  fidelized_by: string;

  // Person data (flattened)
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

  // Note: person_id and all audit fields are concealed for security reasons
}
