import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { WhatsappSessionService } from "@/Application/Services/whatsapp-session.service";
import { WhatsappSessionCreateDto, WhatsappSessionUpdateDto, WhatsappSessionResponseDto } from "@/Application/DTOs/WhatsappSession";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";
import { TenantId } from "@/Application/Features/auth.guard";

@ApiTags("WhatsApp Sessions")
@Controller("whatsapp-sessions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WhatsappSessionController {
  private readonly logger = new Logger(WhatsappSessionController.name);

  constructor(private readonly whatsappSessionService: WhatsappSessionService) {}

  @Get()
  @ApiOperation({
    summary: "Get all WhatsApp sessions",
    description: "Retrieve all WhatsApp sessions for the current tenant.",
  })
  @ApiResponse({ status: 200, description: "Sessions retrieved successfully.", type: [WhatsappSessionResponseDto] })
  async findAll(@TenantId() tenantId: string): Promise<WhatsappSessionResponseDto[]> {
    this.logger.log(`Getting all WhatsApp sessions for tenant: ${tenantId}`);
    return this.whatsappSessionService.findAll(tenantId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get WhatsApp session by ID",
    description: "Retrieve a specific WhatsApp session by its ID.",
  })
  @ApiResponse({ status: 200, description: "Session retrieved successfully.", type: WhatsappSessionResponseDto })
  @ApiResponse({ status: 404, description: "Session not found." })
  async findOne(@Param("id") id: string, @TenantId() tenantId: string): Promise<WhatsappSessionResponseDto> {
    this.logger.log(`Getting WhatsApp session: ${id} for tenant: ${tenantId}`);
    return this.whatsappSessionService.findOne(id, tenantId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create WhatsApp session",
    description: "Create a new WhatsApp session and generate QR code for authentication.",
  })
  @ApiBody({ type: WhatsappSessionCreateDto })
  @ApiResponse({ status: 201, description: "Session created successfully.", type: WhatsappSessionResponseDto })
  @ApiResponse({ status: 400, description: "Invalid session data." })
  async create(
    @Body() createSessionDto: WhatsappSessionCreateDto,
    @TenantId() tenantId: string,
  ): Promise<WhatsappSessionResponseDto> {
    this.logger.log(`Creating WhatsApp session: ${createSessionDto.session_name} for tenant: ${tenantId}`);
    
    // Override tenant_id from JWT
    createSessionDto.tenant_id = tenantId;
    
    return this.whatsappSessionService.create(createSessionDto);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update WhatsApp session",
    description: "Update an existing WhatsApp session.",
  })
  @ApiBody({ type: WhatsappSessionUpdateDto })
  @ApiResponse({ status: 200, description: "Session updated successfully.", type: WhatsappSessionResponseDto })
  @ApiResponse({ status: 404, description: "Session not found." })
  async update(
    @Param("id") id: string,
    @Body() updateSessionDto: WhatsappSessionUpdateDto,
    @TenantId() tenantId: string,
  ): Promise<WhatsappSessionResponseDto> {
    this.logger.log(`Updating WhatsApp session: ${id} for tenant: ${tenantId}`);
    return this.whatsappSessionService.update(id, updateSessionDto, tenantId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete WhatsApp session",
    description: "Delete a WhatsApp session and remove it from WAHA.",
  })
  @ApiResponse({ status: 204, description: "Session deleted successfully." })
  @ApiResponse({ status: 404, description: "Session not found." })
  async delete(@Param("id") id: string, @TenantId() tenantId: string): Promise<void> {
    this.logger.log(`Deleting WhatsApp session: ${id} for tenant: ${tenantId}`);
    await this.whatsappSessionService.delete(id, tenantId);
  }

  @Post(":id/refresh-qr")
  @ApiOperation({
    summary: "Refresh QR code",
    description: "Generate a new QR code for a pending WhatsApp session.",
  })
  @ApiResponse({ status: 200, description: "QR code refreshed successfully.", type: WhatsappSessionResponseDto })
  @ApiResponse({ status: 400, description: "Cannot refresh QR code for connected session." })
  @ApiResponse({ status: 404, description: "Session not found." })
  async refreshQRCode(@Param("id") id: string, @TenantId() tenantId: string): Promise<WhatsappSessionResponseDto> {
    this.logger.log(`Refreshing QR code for WhatsApp session: ${id} for tenant: ${tenantId}`);
    return this.whatsappSessionService.refreshQRCode(id, tenantId);
  }

  @Get(":id/state")
  @ApiOperation({
    summary: "Get session state",
    description: "Get the current state of a WhatsApp session from WAHA.",
  })
  @ApiResponse({ status: 200, description: "Session state retrieved successfully." })
  @ApiResponse({ status: 404, description: "Session not found." })
  async getSessionState(@Param("id") id: string, @TenantId() tenantId: string): Promise<any> {
    this.logger.log(`Getting state for WhatsApp session: ${id} for tenant: ${tenantId}`);
    return this.whatsappSessionService.getSessionState(id, tenantId);
  }
}
