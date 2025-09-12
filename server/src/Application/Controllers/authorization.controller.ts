import {
  Controller,
  Post,
  Body,
  Headers,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";
import { AuthorizationService } from "@/Application/Services/authorization.service";
import {
  AuthorizationRequestDto,
  AuthorizationResponseDto,
} from "@/Application/DTOs/Authorization";

@ApiTags("auth")
@Controller("auth")
export class AuthorizationController {
  private readonly logger = new Logger(AuthorizationController.name);

  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate user and return JWT token" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthorizationResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(
    @Body() authRequest: AuthorizationRequestDto,
  ): Promise<AuthorizationResponseDto> {
    this.logger.log(`Login attempt for username: ${authRequest.username}`);

    const result = await this.authorizationService.validateUser(
      authRequest.username,
      authRequest.password,
    );

    if (!result.user) {
      this.logger.warn(
        `Login failed for username: ${authRequest.username} - ${result.error}`,
      );
      throw new UnauthorizedException(result.error || "Invalid credentials");
    }

    this.logger.log(`Login successful for username: ${authRequest.username}`);
    return this.authorizationService.createToken(result.user);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout user and invalidate JWT token" })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiHeader({
    name: "X-User-Secret",
    description: "User secret for additional validation",
    required: false,
  })
  @ApiResponse({ status: 200, description: "Logout successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async logout(
    @Headers("authorization") authHeader: string,
    @Headers("x-user-secret") userSecret?: string,
  ) {
    this.logger.log("Logout attempt");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      this.logger.warn("Logout failed: Invalid authorization header");
      throw new UnauthorizedException("Invalid authorization header");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Validate token before invalidating
      await this.authorizationService.validateToken(token);
      await this.authorizationService.logout(token, userSecret);

      this.logger.log("Logout successful");
      return { message: "Logout successful" };
    } catch (error) {
      this.logger.warn(`Logout failed: ${error.message}`);
      throw new UnauthorizedException("Invalid token");
    }
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh JWT token" })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: AuthorizationResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async refresh(
    @Headers("authorization") authHeader: string,
  ): Promise<AuthorizationResponseDto> {
    this.logger.log("Token refresh attempt");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      this.logger.warn("Token refresh failed: Invalid authorization header");
      throw new UnauthorizedException("Invalid authorization header");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const result = await this.authorizationService.refreshToken(token);
      this.logger.log("Token refresh successful");
      return result;
    } catch (error) {
      this.logger.warn(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }
}
