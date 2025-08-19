import { AuthorizationService } from '@/Application/Services/authorization.service';
import { AuthorizationRequestDto, AuthorizationResponseDto } from '@/Application/DTOs/Authorization';
export declare class AuthorizationController {
    private readonly authorizationService;
    private readonly logger;
    constructor(authorizationService: AuthorizationService);
    login(authRequest: AuthorizationRequestDto): Promise<AuthorizationResponseDto>;
    logout(authHeader: string): Promise<{
        message: string;
    }>;
    refresh(authHeader: string): Promise<AuthorizationResponseDto>;
}
