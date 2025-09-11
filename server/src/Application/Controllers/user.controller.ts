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
import { UserValidator } from "@/Application/Validators/user.validator";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";
import { AuthorizationService } from "@/Application/Services/authorization.service";

@ApiTags("users")
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
    @Inject(forwardRef(() => AuthorizationService))
    private readonly authorizationService: AuthorizationService,
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
  @ApiResponse({
    status: 200,
    description: "Returns user details",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Insufficient user level",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(@Param("id") id: string, @Request() req: any): Promise<UserResponseDto> {
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
  @ApiOperation({ summary: "Update user by ID" })
  @ApiParam({ name: "id", description: "User ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
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
  ): Promise<UserResponseDto> {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }

    // Verify user belongs to the same tenant by checking the raw user data
    const user = await this.userService.findByUsername(
      updateUserDto.username || "",
    );
    if (user && user.tenant_id !== tenantId) {
      throw new UnauthorizedException(
        "User does not belong to the specified tenant",
      );
    }

    await this.userValidator.validateUpdate(updateUserDto);
    return this.userService.update(id, updateUserDto);
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
}
