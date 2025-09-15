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
  BadRequestException,
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
import { BusinessService } from "@/Application/Services/business.service";
import { AuthorizationService } from "@/Application/Services/authorization.service";
import {
  BusinessCreateDto,
  BusinessUpdateDto,
  BusinessResponseDto,
} from "@/Application/DTOs";
import { AuthorizationResponseDto } from "@/Application/DTOs/Authorization/authorization-response.dto";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";
import { TestAuthGuard } from "@/Application/Features/test-auth.guard";

@ApiTags("businesses")
@Controller("businesses")
export class BusinessController {
  private readonly logger = new Logger(BusinessController.name);

  constructor(
    private readonly businessService: BusinessService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Get()
  @UseGuards(
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
      ? TestAuthGuard
      : JwtAuthGuard,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all businesses with pagination (Developer Only)",
    description:
      "Retrieves a paginated list of all businesses. This endpoint requires developer level (10) access. In production, this endpoint is restricted to developers only.",
  })
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
    description: "Returns paginated list of businesses",
    schema: {
      type: "object",
      properties: {
        businesses: {
          type: "array",
          items: { $ref: "#/components/schemas/BusinessResponseDto" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
        totalPages: { type: "number" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Developer level required",
  })
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Request() req: any,
  ): Promise<{
    businesses: BusinessResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userLevel = req.userLevel;

    // Check user clearance - only developers (level 10) can access findAll
    if (userLevel < 10) {
      this.logger.warn(
        `User with level ${userLevel} attempted to access findAll - access denied`,
      );
      throw new BadRequestException(
        "Access denied. Developer level (10) required to view all businesses.",
      );
    }

    return this.businessService.findAll(page, limit, userLevel);
  }

  @Get(":id")
  @UseGuards(
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
      ? TestAuthGuard
      : JwtAuthGuard,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get business by ID",
    description:
      "Retrieves business details by ID. If ID matches current user's tenantId, returns business with relations (equivalent to /me). For other businesses, requires admin level (8+) access.",
  })
  @ApiParam({ name: "id", description: "Business ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Returns business details",
    type: BusinessResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Admin level required for other businesses",
  })
  @ApiResponse({ status: 404, description: "Business not found" })
  async findOne(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<BusinessResponseDto> {
    const userLevel = req.userLevel;
    const userTenantId = req.tenantId;

    // Check if this is the user's own business (equivalent to "me")
    if (userTenantId === id) {
      this.logger.log(`Fetching own business for tenant: ${userTenantId}`);
      return this.businessService.findOneWithRelations(id);
    }

    // For other businesses, require admin level
    if (userLevel < 8) {
      throw new BadRequestException(
        "Access denied. Admin level (8+) required to view other business details.",
      );
    }

    return this.businessService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new business with master user",
    description:
      "Creates a new business and automatically creates a master user (owner) with user_level 9. The master user cannot be deleted and has full administrative privileges. Returns an authentication token for the master user.",
  })
  @ApiResponse({
    status: 201,
    description: "Business and master user created successfully",
    type: AuthorizationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error or master user username already exists",
  })
  @ApiResponse({
    status: 409,
    description: "Master user username already exists",
  })
  async create(
    @Body() createBusinessDto: BusinessCreateDto,
  ): Promise<AuthorizationResponseDto> {
    // TODO: Add confirmation step to create user - implement user creation confirmation logic
    const result = await this.businessService.create(createBusinessDto);

    // Create JWT token for the master user using DTO
    const authToken = await this.authorizationService.createTokenFromDto(
      result.masterUserDto,
      result.masterUserLevel,
      result.tenantId,
    );

    return authToken;
  }

  @Put(":id")
  @UseGuards(
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
      ? TestAuthGuard
      : JwtAuthGuard,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update business by ID",
    description:
      "Updates business information. If ID matches current user's tenantId, allows update (equivalent to /me). For other businesses, requires admin level (8+) access.",
  })
  @ApiParam({ name: "id", description: "Business ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Business updated successfully",
    type: BusinessResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Admin level required for other businesses",
  })
  @ApiResponse({ status: 404, description: "Business not found" })
  @ApiResponse({ status: 400, description: "Validation error" })
  async update(
    @Param("id") id: string,
    @Body() updateBusinessDto: BusinessUpdateDto,
    @Request() req: any,
  ): Promise<BusinessResponseDto> {
    const userLevel = req.userLevel;
    const userTenantId = req.tenantId;

    // Check if this is the user's own business (equivalent to "me")
    if (userTenantId === id) {
      this.logger.log(`Updating own business for tenant: ${userTenantId}`);
      return this.businessService.update(id, updateBusinessDto);
    }

    // For other businesses, require admin level
    if (userLevel < 8) {
      throw new BadRequestException(
        "Access denied. Admin level (8+) required to update other businesses.",
      );
    }

    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(":id")
  @UseGuards(
    process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
      ? TestAuthGuard
      : JwtAuthGuard,
  )
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Soft delete business by ID (Developer Only)",
    description:
      'Performs a soft delete of the business. This endpoint requires developer level (10) access. The "id" parameter is the tenant_id from the request.',
  })
  @ApiParam({
    name: "id",
    description: "Business ID (UUID) - must match tenant_id from request",
  })
  @ApiResponse({ status: 204, description: "Business deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Developer level required",
  })
  @ApiResponse({ status: 404, description: "Business not found" })
  async remove(@Param("id") id: string, @Request() req: any) {
    const userLevel = req.userLevel;
    const userTenantId = req.tenantId;

    if (userLevel < 10) {
      throw new BadRequestException(
        "Access denied. Developer level (10) required to delete business.",
      );
    }

    // The "id" parameter must match the tenant_id from the request
    if (userTenantId && userTenantId !== id) {
      throw new BadRequestException(
        "Access denied. The business ID must match your tenant ID.",
      );
    }

    return this.businessService.remove(id);
  }
}
