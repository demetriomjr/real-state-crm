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
import { ChatService } from "@/Application/Services/chat.service";
import {
  CreateChatDto,
  UpdateChatDto,
  ChatResponseDto,
  CreateMessageDto,
  MessageResponseDto,
} from "@/Application/DTOs";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";

@ApiTags("chats")
@Controller("chats")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: "Get all chats with pagination" })
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
    description: "Returns paginated list of chats",
    type: [ChatResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Request() req: any,
  ) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    return this.chatService.findAll(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get chat by ID" })
  @ApiParam({ name: "id", description: "Chat ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Returns chat details",
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Chat not found" })
  async findOne(@Param("id") id: string, @Request() req: any) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    return this.chatService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new chat" })
  @ApiResponse({
    status: 201,
    description: "Chat created successfully",
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  async create(@Body() createChatDto: CreateChatDto, @Request() req: any) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    return this.chatService.create(createChatDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update chat by ID" })
  @ApiParam({ name: "id", description: "Chat ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Chat updated successfully",
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: "Chat not found" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async update(
    @Param("id") id: string,
    @Body() updateChatDto: UpdateChatDto,
    @Request() req: any = {},
  ) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    return this.chatService.update(id, updateChatDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Soft delete chat by ID (Developer Only)" })
  @ApiParam({ name: "id", description: "Chat ID (UUID)" })
  @ApiResponse({ status: 204, description: "Chat deleted successfully" })
  @ApiResponse({ status: 404, description: "Chat not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Access denied - Developer level required",
  })
  async remove(@Param("id") id: string, @Request() req: any = {}) {
    const userLevel = req.userLevel;

    if (userLevel < 10) {
      this.logger.warn(
        `User with level ${userLevel} attempted to delete chat - access denied`,
      );
      throw new BadRequestException(
        "Access denied. Developer level (10) required to delete chats.",
      );
    }

    return this.chatService.remove(id);
  }

  @Get(":id/messages")
  @ApiOperation({ summary: "Get messages for a chat with pagination" })
  @ApiParam({ name: "id", description: "Chat ID (UUID)" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 50)",
  })
  @ApiQuery({
    name: "last_message_datetime",
    required: false,
    description: "Get messages after this datetime",
  })
  @ApiResponse({
    status: 200,
    description: "Returns paginated list of messages",
    type: [MessageResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Chat not found" })
  async findMessages(
    @Param("id") id: string,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
    @Query("last_message_datetime") lastMessageDateTime?: string,
    @Request() req: any = {},
  ) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    const lastMessageDate = lastMessageDateTime
      ? new Date(lastMessageDateTime)
      : undefined;
    return this.chatService.findMessages(id, lastMessageDate, page, limit);
  }

  @Post(":id/messages")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create messages for a chat" })
  @ApiParam({ name: "id", description: "Chat ID (UUID)" })
  @ApiResponse({
    status: 201,
    description: "Messages created successfully",
    type: [MessageResponseDto],
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Chat not found" })
  async createMessages(
    @Param("id") id: string,
    @Body() createMessageDtos: CreateMessageDto[],
    @Request() req: any = {},
  ) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    // Ensure all messages belong to the specified chat
    for (const messageDto of createMessageDtos) {
      if (messageDto.chat_id !== id) {
        throw new BadRequestException(
          "All messages must belong to the specified chat",
        );
      }
    }

    return this.chatService.createMessages(createMessageDtos);
  }
}
