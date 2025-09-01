import { ApiProperty } from "@nestjs/swagger";

export class BusinessResponseDto {
  @ApiProperty({ description: "Company name" })
  company_name: string;

  @ApiProperty({ description: "Subscription level" })
  subscription: number;

  @ApiProperty({ description: "Subscription level description" })
  subscription_level: string;

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

  // Note: id and tenant_id are concealed for security reasons
}
