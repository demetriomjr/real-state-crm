import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { AuthorizationResponseDto, JwtPayload } from '@/Application/DTOs/Authorization';
export declare class AuthorizationService {
    private readonly jwtService;
    private readonly userService;
    private readonly configService;
    private readonly logger;
    private readonly expiredTokensCache;
    private readonly maxCacheSize;
    constructor(jwtService: JwtService, userService: UserService, configService: ConfigService);
    validateUser(username: string, password: string): Promise<any>;
    createToken(user: any): Promise<AuthorizationResponseDto>;
    validateToken(token: string): Promise<JwtPayload>;
    refreshToken(token: string): Promise<AuthorizationResponseDto>;
    invalidateToken(token: string): void;
    isDevelopmentEnvironment(): boolean;
}
