import {
  Controller,
  Post,
  Body,
  Headers,
  HttpStatus,
  HttpCode,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBody,
} from "@nestjs/swagger";
import { ChatMessagingService } from "@/Application/Services/chat-messaging.service";

@ApiTags("Integrated Services - WhatsApp")
@Controller("integrated-services")
export class IntegratedServicesController {
  private readonly logger = new Logger(IntegratedServicesController.name);

  constructor(private readonly messagingService: ChatMessagingService) {}

  @Post("whatsapp/webhook")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "WhatsApp Webhook",
    description:
      "Endpoint for receiving incoming messages and events from n8n/WAHA.",
  })
  @ApiHeader({
    name: "X-Webhook-Secret",
    description: "Webhook secret for verification.",
    required: true,
  })
  @ApiResponse({ status: 200, description: "Message received successfully." })
  @ApiResponse({ status: 400, description: "Invalid webhook data." })
  @ApiResponse({ status: 401, description: "Invalid webhook secret." })
  async whatsappWebhook(
    @Body() webhookData: any,
    @Headers("x-webhook-secret") webhookSecret?: string,
  ) {
    this.logger.log("WhatsApp webhook received");

    const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
    if (expectedSecret && webhookSecret !== expectedSecret) {
      this.logger.warn("Invalid webhook secret received");
      throw new UnauthorizedException("Invalid webhook secret");
    }

    if (!webhookData) {
      this.logger.warn("Empty webhook data received");
      throw new BadRequestException("Webhook data is required");
    }

    try {
      await this.messagingService.receiveMessage(webhookData);
      return { status: "success", message: "Message processed successfully" };
    } catch (error: any) {
      this.logger.error(
        `Error processing WhatsApp webhook: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException("Error processing webhook data");
    }
  }

  @Post("whatsapp/send")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send WhatsApp Message",
    description:
      "Sends a message to a specific chat using its associated session (via n8n).",
  })
  @ApiBody({
    description: "Message data containing the chat ID and text to send.",
    schema: {
      type: "object",
      properties: {
        chatId: { type: "string", example: "your-chat-id" },
        text: { type: "string", example: "Hello from the API!" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Message sent successfully." })
  @ApiResponse({ status: 400, description: "Invalid message data." })
  @ApiResponse({ status: 404, description: "Chat not found." })
  async sendWhatsappMessage(@Body() messageData: { chatId: string; text: string }) {
    this.logger.log(`Sending WhatsApp message to chat: ${messageData.chatId}`);
    return this.messagingService.sendMessage(messageData.chatId, messageData.text);
  }
}
