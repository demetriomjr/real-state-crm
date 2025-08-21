import { ApiProperty } from '@nestjs/swagger';
import { BusinessResponseDto } from './business-response.dto';
import { AuthorizationResponseDto } from '../Authorization/authorization-response.dto';

export class BusinessCreateResponseDto {
  @ApiProperty({ description: 'Business information with ID', type: BusinessResponseDto })
  business: BusinessResponseDto & { id: string };

  @ApiProperty({ description: 'Master user information' })
  master_user: {
    id: string;
    fullName: string;
    username: string;
    user_level: number;
  };

  @ApiProperty({ description: 'Authentication token for the master user', type: AuthorizationResponseDto })
  auth: AuthorizationResponseDto;

  @ApiProperty({ description: 'Success message' })
  message: string;
}
