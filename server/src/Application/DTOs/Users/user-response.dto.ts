import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "User ID (UUID)" })
  id: string;

  @ApiProperty({ description: "Full name of the user" })
  fullName: string;

  @ApiProperty({ description: "Unique username" })
  username: string;

  // Note: user_level, tenant_id, and all audit fields are concealed for security reasons
}
