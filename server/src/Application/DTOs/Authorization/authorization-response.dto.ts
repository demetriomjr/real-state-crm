import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationResponseDto {
  @ApiProperty({ description: 'JWT token for authentication', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiProperty({ description: 'Token expiration date', example: '2024-01-01T12:00:00.000Z' })
  expires_at: Date;
}
