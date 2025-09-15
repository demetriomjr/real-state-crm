import { ApiProperty } from "@nestjs/swagger";

export class AuthorizationResponseDto {
  @ApiProperty({
    description: "JWT token for authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  token: string;

  @ApiProperty({
    description: "User secret for additional authentication validation",
    example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  })
  userSecret: string;

  @ApiProperty({
    description: "Token expiration date",
    example: "2024-01-01T12:00:00.000Z",
  })
  expires_at: Date;

  @ApiProperty({
    description: "User ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  userId: string;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
  })
  userFullName: string;

  // Note: username, userLevel, and userRoles are removed from frontend response
  // for security reasons. These values are available in JWT payload and
  // should be validated server-side only.
}
