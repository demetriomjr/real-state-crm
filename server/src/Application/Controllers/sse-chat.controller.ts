import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Res,
  Request,
  UseGuards,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";
import { SSEChatService } from "@/Application/Services/sse-chat.service";

@ApiTags("sse-chat")
@Controller("sse-chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SSEChatController {
  private readonly logger = new Logger(SSEChatController.name);

  constructor(private readonly sseChatService: SSEChatService) {}

  @Get("subscribe/:chatId")
  @ApiOperation({ summary: "Subscribe to SSE for real-time chat updates" })
  @ApiParam({ name: "chatId", description: "Chat ID (UUID)" })
  @ApiResponse({ status: 200, description: "SSE connection established" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Chat not found" })
  async subscribe(
    @Param("chatId") chatId: string,
    @Res() res: Response,
    @Query("lastMessageDateTime") lastMessageDateTime?: string,
    @Request() req: any = {},
  ) {
    const userId = req.user?.id;
    const userLevel = req.userLevel;

    if (!userId || userLevel < 1) {
      throw new UnauthorizedException("User authentication required");
    }

    this.logger.log(`User ${userId} subscribing to chat ${chatId}`);

    // Set SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    // Send initial connection message
    res.write(
      `data: ${JSON.stringify({ type: "connection", message: "SSE connection established" })}\n\n`,
    );

    // Subscribe to chat updates
    const subscription = await this.sseChatService.subscribe(
      userId,
      chatId,
      res,
      lastMessageDateTime,
    );

    // Handle client disconnect
    req.on("close", () => {
      this.logger.log(`User ${userId} disconnected from chat ${chatId}`);
      this.sseChatService.unsubscribe(userId);
    });

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
      if (!res.destroyed) {
        res.write(
          `data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date().toISOString() })}\n\n`,
        );
      } else {
        clearInterval(heartbeat);
        this.sseChatService.unsubscribe(userId);
      }
    }, 30000); // 30 seconds heartbeat
  }

  @Post("unsubscribe")
  @ApiOperation({ summary: "Unsubscribe from SSE chat updates" })
  @ApiResponse({ status: 200, description: "Successfully unsubscribed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async unsubscribe(@Request() req: any = {}) {
    const userId = req.user?.id;
    const userLevel = req.userLevel;

    if (!userId || userLevel < 1) {
      throw new UnauthorizedException("User authentication required");
    }

    this.logger.log(`User ${userId} unsubscribing from chat`);
    this.sseChatService.unsubscribe(userId);

    return { message: "Successfully unsubscribed" };
  }
}
