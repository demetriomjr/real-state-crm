import { ApiProperty } from "@nestjs/swagger";
import { AddressResponseDto } from "../People/address-response.dto";
import { ContactResponseDto } from "../People/contact-response.dto";
import { DocumentResponseDto } from "../People/document-response.dto";

export class BusinessResponseDto {
  @ApiProperty({ description: "Business ID" })
  id: string;

  @ApiProperty({ description: "Company name" })
  company_name: string;

  @ApiProperty({ description: "Subscription level description" })
  subscription_level: string;

  @ApiProperty({ description: "Date of business creation" })
  created_at: Date;

  // Flattened Person data (Person is a fragment, not a separate entity)
  @ApiProperty({ description: "Full name of the person" })
  full_name: string;

  // Person-related data (addresses, contacts, documents as Business properties)
  @ApiProperty({
    description: "Business addresses",
    type: [AddressResponseDto],
  })
  addresses: AddressResponseDto[];

  @ApiProperty({
    description: "Business contacts",
    type: [ContactResponseDto],
  })
  contacts: ContactResponseDto[];

  @ApiProperty({
    description: "Business documents",
    type: [DocumentResponseDto],
  })
  documents: DocumentResponseDto[];

  // Note: tenant_id, person_id, and subscription are concealed for security reasons
  // Note: All audit fields (created_by, updated_at, updated_by, deleted_at, deleted_by, person_created_at, person_updated_at) are removed from response DTOs
}
