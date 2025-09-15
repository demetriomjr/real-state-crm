import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { UserService } from "./user.service";
import { UserSecretCacheService } from "./user-secret-cache.service";
import { UserLoginLogService } from "./user-login-log.service";
import {
  AuthorizationResponseDto,
  JwtPayload,
} from "@/Application/DTOs/Authorization";
import { UserResponseDto } from "@/Application/DTOs";

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);
  private readonly expiredTokensCache: Set<string> = new Set();
  private readonly maxCacheSize = 100;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly userSecretCache: UserSecretCacheService,
    private readonly userLoginLogService: UserLoginLogService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ user: any | null; error: string | null }> {
    try {
      // Find user by username (case-insensitive)
      const user = await this.userService.findByUsername(
        username.toLowerCase(),
      );
      if (!user) {
        this.logger.warn(`User ${username} not found`);
        return {
          user: null,
          error: `Username '${username}' not found. Please check your credentials.`,
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user ${username}`);
        return {
          user: null,
          error: "Invalid password. Please check your password and try again.",
        };
      }

      return { user, error: null };
    } catch (error) {
      this.logger.error(`Error validating user ${username}:`, error);
      return {
        user: null,
        error: "An error occurred during authentication. Please try again.",
      };
    }
  }

  async createToken(user: any): Promise<AuthorizationResponseDto> {
    this.logger.log(`Creating token for user: ${user.username}`);

    // Generate userSecret for this session
    const userSecret = this.userSecretCache.generateUserSecret();

    const payload: JwtPayload = {
      tenant_id: user.tenant_id,
      user_id: user.id,
      user_level: user.user_level,
    };

    // Add refresh_id if provided
    if (user.refresh_id) {
      payload.refresh_id = user.refresh_id;
    }

    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "30m");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

    const token = this.jwtService.sign(payload, {
      expiresIn,
      secret: this.configService.get<string>("JWT_SECRET"),
    });

    // Store userSecret in cache with user data
    this.userSecretCache.storeUserSecret(
      userSecret,
      user.id,
      user.tenant_id,
      user.user_level,
      30, // 30 minutes expiration
    );

    return {
      token,
      userSecret,
      expires_at: expiresAt,
      userId: user.id,
      userFullName: user.person?.full_name || user.username, // Use person's full_name or fallback to username
      // Note: username, userLevel, and userRoles removed for security - available in JWT payload only
    };
  }

  async createTokenFromDto(
    userDto: UserResponseDto,
    userLevel: number,
    tenantId: string,
  ): Promise<AuthorizationResponseDto> {
    this.logger.log(`Creating token from DTO for user: ${userDto.id}`);

    // Generate userSecret for this session
    const userSecret = this.userSecretCache.generateUserSecret();

    const payload: JwtPayload = {
      tenant_id: tenantId,
      user_id: userDto.id,
      user_level: userLevel,
    };

    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "30m");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

    const token = this.jwtService.sign(payload, {
      expiresIn,
      secret: this.configService.get<string>("JWT_SECRET"),
    });

    // Store userSecret in cache with user data
    this.userSecretCache.storeUserSecret(
      userSecret,
      userDto.id,
      tenantId,
      userLevel,
      30, // 30 minutes expiration
    );

    return {
      token,
      userSecret,
      expires_at: expiresAt,
      userId: userDto.id,
      userFullName: userDto.full_name,
      // Note: username, userLevel, and userRoles removed for security - available in JWT payload only
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    // Check if token is in expired cache
    if (this.expiredTokensCache.has(token)) {
      this.logger.warn("Attempted to use invalidated token");
      throw new UnauthorizedException("Token has been invalidated");
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      }) as JwtPayload;

      // Skip user validation in development and test environments
      const nodeEnv = this.configService.get<string>("NODE_ENV");
      if (nodeEnv === "development" || nodeEnv === "test") {
        this.logger.log(
          `Token validated for user: ${payload.user_id} (${nodeEnv} mode)`,
        );
        return payload;
      }

      // Verify user still exists by user_id and tenant_id
      const user = await this.userService.findOneRaw(payload.user_id);
      if (!user || user.tenant_id !== payload.tenant_id) {
        this.logger.warn(
          `Token validation failed: User ${payload.user_id} not found or tenant mismatch`,
        );
        throw new UnauthorizedException("User not found");
      }

      this.logger.log(`Token validated for user: ${payload.user_id}`);
      return payload;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException("Invalid token");
    }
  }

  async refreshToken(token: string): Promise<AuthorizationResponseDto> {
    this.logger.log("Refreshing token");
    const payload = await this.validateToken(token);

    // Skip user validation in development and test environments
    const nodeEnv = this.configService.get<string>("NODE_ENV");
    if (nodeEnv === "development" || nodeEnv === "test") {
      // In test mode, we'll create a mock user object for token creation
      const mockUser = {
        id: payload.user_id,
        tenant_id: payload.tenant_id,
        user_level: payload.user_level,
        username: "test-user",
      };

      // Invalidate old token
      this.invalidateToken(token);

      // Create new token with unique identifier
      this.logger.log(
        `Token refreshed for user: ${payload.user_id} (${nodeEnv} mode)`,
      );
      const mockUserWithId = {
        ...mockUser,
        refresh_id: Date.now(), // Add unique identifier for refresh
      };
      return this.createToken(mockUserWithId);
    }

    // Get fresh user data with person information
    const user = await this.userService.findOneRaw(payload.user_id);
    if (!user || user.tenant_id !== payload.tenant_id) {
      this.logger.warn(
        `Token refresh failed: User ${payload.user_id} not found or tenant mismatch`,
      );
      throw new UnauthorizedException("User not found");
    }

    // Invalidate old token
    this.invalidateToken(token);

    // Create new token
    this.logger.log(`Token refreshed for user: ${payload.user_id}`);
    return this.createToken(user);
  }

  invalidateToken(token: string): void {
    this.logger.log("Invalidating token");
    // Add token to expired cache
    this.expiredTokensCache.add(token);

    // Remove oldest tokens if cache is full
    if (this.expiredTokensCache.size > this.maxCacheSize) {
      const tokensArray = Array.from(this.expiredTokensCache);
      const oldestToken = tokensArray[0];
      this.expiredTokensCache.delete(oldestToken);
      this.logger.log("Token cache cleanup performed");
    }
  }

  async logout(
    token: string,
    userSecret?: string,
  ): Promise<{ message: string }> {
    this.logger.log("User logout requested");
    this.invalidateToken(token);

    // Also remove userSecret from cache if provided
    if (userSecret) {
      this.userSecretCache.removeUserSecret(userSecret);
    }

    return { message: "Logged out successfully" };
  }

  isDevelopmentEnvironment(): boolean {
    return this.configService.get<string>("NODE_ENV") === "development";
  }
}
