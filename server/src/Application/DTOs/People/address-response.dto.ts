import { ApiProperty } from "@nestjs/swagger";

export class AddressResponseDto {
  @ApiProperty({ description: "Address ID", example: "uuid-string" })
  id: string;

  @ApiProperty({ description: "Street address", example: "123 Main St" })
  street: string;

  @ApiProperty({ description: "City", example: "São Paulo" })
  city: string;

  @ApiProperty({ description: "State/Province", example: "SP" })
  state: string;

  @ApiProperty({ description: "Postal code", example: "01234-567" })
  postal_code: string;

  @ApiProperty({ description: "Country", example: "Brazil" })
  country: string;

  @ApiProperty({ description: "Is primary address", example: true })
  @ApiProperty({ description: "Is default address", example: true })
  is_default: boolean;

  // Note: person_id and all audit fields (created_by, updated_by, deleted_by, timestamps) are concealed for security reasons
}
