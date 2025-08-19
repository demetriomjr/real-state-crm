import { BusinessResponseDto } from './business-response.dto';
import { AuthorizationResponseDto } from '../Authorization/authorization-response.dto';
export declare class BusinessCreateResponseDto {
    business: BusinessResponseDto;
    master_user: {
        id: string;
        fullName: string;
        username: string;
        user_level: number;
    };
    auth: AuthorizationResponseDto;
    message: string;
}
