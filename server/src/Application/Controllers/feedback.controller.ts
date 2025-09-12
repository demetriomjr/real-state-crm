import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  UnauthorizedException,
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
import { FeedbackService } from "@/Application/Services/feedback.service";
import { CreateFeedbackDto, FeedbackResponseDto } from "@/Application/DTOs";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";

@ApiTags("feedback")
@Controller("feedback")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiOperation({ summary: "Get all feedbacks with pagination" })
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
    description: "Returns paginated list of feedbacks",
    type: [FeedbackResponseDto],
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

    return this.feedbackService.findAll(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get feedback by ID" })
  @ApiParam({ name: "id", description: "Feedback ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Returns feedback details",
    type: FeedbackResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Feedback not found" })
  async findOne(@Param("id") id: string, @Request() req: any) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    return this.feedbackService.findOne(id);
  }

  @Get("chat/:chatId")
  @ApiOperation({ summary: "Get feedbacks for a specific chat" })
  @ApiParam({ name: "chatId", description: "Chat ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Returns list of feedbacks for the chat",
    type: [FeedbackResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Chat not found" })
  async findByChatId(@Param("chatId") chatId: string, @Request() req: any) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    return this.feedbackService.findByChatId(chatId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new feedback (AI-generated or user-prompted)",
  })
  @ApiResponse({
    status: 201,
    description: "Feedback created successfully",
    type: FeedbackResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: any,
  ) {
    const userLevel = req.userLevel;

    if (userLevel < 1) {
      throw new UnauthorizedException("User level required");
    }

    // Set the user_id from the authenticated user if not provided
    if (!createFeedbackDto.user_id) {
      createFeedbackDto.user_id = req.user?.id;
    }

    return this.feedbackService.create(createFeedbackDto);
  }
}
