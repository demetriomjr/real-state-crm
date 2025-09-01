import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "User ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Full name of the user" })
  fullName: string;

  @ApiProperty({ description: "Unique username" })
  username: string;

  // Note: user_level and tenant_id are concealed for security reasons

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
}
