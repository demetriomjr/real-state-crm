import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UserService } from "@/Application/Services/user.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "@/Application/DTOs";
import { AuthorizationResponseDto } from "@/Application/DTOs/Authorization";
import { UserValidator } from "@/Application/Validators/user.validator";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";
import { AuthorizationService } from "@/Application/Services/authorization.service";
import { UserLoginLogService } from "@/Application/Services/user-login-log.service";
import { PasswordService } from "@/Application/Services/password.service";
import {
  PasswordChangeDto,
  PasswordChangeResponseDto,
} from "@/Application/DTOs/Users/password-change.dto";

@ApiTags("users")
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
    @Inject(forwardRef(() => AuthorizationService))
    private readonly authorizationService: AuthorizationService,
    private readonly userLoginLogService: UserLoginLogService,
    private readonly passwordService: PasswordService,
  ) {}

  @Get("check-username/:username")
  @ApiOperation({ summary: "Check if username is available" })
  @ApiParam({ name: "username", description: "Username to check" })
  @ApiResponse({
    status: 200,
    description: "Username availability checked",
    schema: {
      type: "object",
      properties: {
        available: { type: "boolean" },
        message: { type: "string" },
      },
    },
  })
  async checkUsername(@Param("username") username: string): Promise<{
    available: boolean;
    message: string;
  }> {
    const existingUser = await this.userService.findByUsername(username);
    return {
      available: !existingUser,
      message: existingUser
        ? "Nome de usuário já está em uso"
        : "Nome de usuário disponível",
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users with pagination (Admin Only)" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 10)",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of users",
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Admin level required",
  })
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Request() req: any,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const tenantId = req.tenantId;
    const userLevel = req.userLevel;

    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }

    // Check user clearance - only admins (level 8+) can retrieve users as FindAll
    if (userLevel < 8) {
      this.logger.warn(
        `User with level ${userLevel} attempted to access findAll - access denied`,
      );
      throw new BadRequestException(
        "Access denied. Admin level (8+) required to view all users.",
      );
    }

    const users = await this.userService.findByTenant(tenantId);
    return {
      users,
      total: users.length,
      page,
      limit,
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User ID (UUID)" })
  @ApiQuery({
    name: "logs",
    required: false,
    description: "Include user login logs (default: false)",
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: "Returns user details, optionally with login logs",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Insufficient user level",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(
    @Param("id") id: string,
    @Request() req: any,
    @Query("logs") includeLogs?: string,
  ): Promise<any> {
    const userLevel = req.userLevel;

    // Get the user to check their level
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Check if user level in request is >= user level of record retrieved
    const targetUser = await this.userService.findByUsername(user.username);
    if (targetUser && userLevel < targetUser.user_level) {
      throw new BadRequestException(
        "Access denied. Your user level is insufficient to view this user.",
      );
    }

    // Include logs if requested
    if (includeLogs === "true") {
      const logs = await this.userLoginLogService.getUserLoginHistory(id, 100);

      return {
        ...user,
        logs: logs,
      };
    }

    return user;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error or username already exists",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    await this.userValidator.validateCreate(createUserDto);
    return this.userService.create(createUserDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update user by ID",
    description:
      "Updates user profile. If updating current user (req.user.user_id === id), returns new authentication data with updated profile.",
  })
  @ApiParam({ name: "id", description: "User ID (UUID)" })
  @ApiResponse({
    status: 200,
    description:
      "User updated successfully. For current user updates, returns new authentication data.",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 400,
    description: "Validation error or username already exists",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ): Promise<UserResponseDto | AuthorizationResponseDto> {
    const tenantId = req.tenantId;
    const currentUserId = req.user.user_id;

    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }

    // Check if this is a profile update (current user updating themselves)
    const isProfileUpdate = currentUserId === id;

    // Verify user belongs to the same tenant by checking the raw user data
    if (updateUserDto.username) {
      const user = await this.userService.findByUsername(
        updateUserDto.username,
      );
      if (user && user.tenant_id !== tenantId && user.id !== id) {
        throw new UnauthorizedException(
          "Username already exists in this tenant",
        );
      }
    }

    await this.userValidator.validateUpdate(updateUserDto);

    if (isProfileUpdate) {
      // For profile updates, use the updateProfile method and return new auth data
      this.logger.log(`Updating profile for user: ${id}`);
      const updatedUser = await this.userService.updateProfile(
        id,
        updateUserDto,
      );

      // Generate new authentication data using DTO and request context
      return await this.authorizationService.createTokenFromDto(
        updatedUser,
        req.userLevel,
        req.tenantId,
      );
    } else {
      // For admin updates of other users, use regular update
      return this.userService.update(id, updateUserDto);
    }
  }

  @Put(":id/password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Validate password change for user",
    description:
      "Validates current password and returns encrypted new password. Does not update the database. User can only validate their own password change.",
  })
  @ApiParam({ name: "id", description: "User ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Password validation successful",
    type: PasswordChangeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - passwords don't match or validation failed",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - current password is incorrect or not own user",
  })
  async validatePasswordChange(
    @Param("id") id: string,
    @Request() req: any,
    @Body() passwordChangeDto: PasswordChangeDto,
  ): Promise<PasswordChangeResponseDto> {
    const currentUserId = req.user.user_id;

    // Users can only validate their own password change
    if (currentUserId !== id) {
      throw new UnauthorizedException(
        "Access denied. You can only change your own password.",
      );
    }

    return this.passwordService.validatePasswordChange(id, passwordChangeDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Soft delete user by ID" })
  @ApiParam({ name: "id", description: "User ID (UUID)" })
  @ApiResponse({ status: 204, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Cannot delete master user (level 9)",
  })
  async remove(@Param("id") id: string, @Request() req: any): Promise<void> {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }

    // Verify user belongs to the same tenant
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Check if user is a master user (level 9)
    const userEntity = await this.userService.findByUsername(user.username);
    if (userEntity && userEntity.user_level === 9) {
      throw new UnauthorizedException("Cannot delete master user (level 9)");
    }

    return this.userService.remove(id);
  }

  @Get(":id/logs")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get user login logs with filtering",
    description:
      "Retrieves paginated login logs for a specific user with optional date filtering",
  })
  @ApiParam({
    name: "id",
    description: "User ID",
    type: "string",
  })
  @ApiQuery({
    name: "startDate",
    description: "Start date for filtering (ISO string)",
    required: false,
    type: "string",
  })
  @ApiQuery({
    name: "endDate",
    description: "End date for filtering (ISO string)",
    required: false,
    type: "string",
  })
  @ApiQuery({
    name: "page",
    description: "Page number (default: 1)",
    required: false,
    type: "number",
  })
  @ApiQuery({
    name: "limit",
    description: "Number of records per page (default: 100, max: 100)",
    required: false,
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "User login logs retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserLogs(
    @Param("id") id: string,
    @Request() req: any,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }

    // Parse query parameters
    const pageNum = parseInt(page || "1", 10);
    const limitNum = Math.min(parseInt(limit || "100", 10), 100); // Max 100 records

    // Parse dates if provided
    let startDateParsed: Date | undefined;
    let endDateParsed: Date | undefined;

    if (startDate) {
      startDateParsed = new Date(startDate);
      if (isNaN(startDateParsed.getTime())) {
        throw new BadRequestException("Invalid start date format");
      }
    }

    if (endDate) {
      endDateParsed = new Date(endDate);
      if (isNaN(endDateParsed.getTime())) {
        throw new BadRequestException("Invalid end date format");
      }
    }

    // Verify user exists and belongs to the same tenant
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.userLoginLogService.findByUserIdWithFilters(id, {
      startDate: startDateParsed,
      endDate: endDateParsed,
      page: pageNum,
      limit: limitNum,
    });
  }
}
