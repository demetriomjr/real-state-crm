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
import { WhatsappWebhookDto } from "@/Application/DTOs/Chat/WhatsappWebhookDto";

@ApiTags("Webhooks - WhatsApp")
@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly messagingService: ChatMessagingService) {}

  @Post("whatsapp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "WhatsApp Webhook",
    description:
      "Endpoint for receiving incoming messages and events from n8n. Handles the complete webhook structure with session, payload, and metadata.",
  })
  @ApiHeader({
    name: "X-Webhook-Secret",
    description: "Webhook secret for verification.",
    required: true,
  })
  @ApiBody({
    description: "WhatsApp webhook data structure",
    type: WhatsappWebhookDto,
  })
  @ApiResponse({ status: 200, description: "Message received successfully." })
  @ApiResponse({ status: 400, description: "Invalid webhook data." })
  @ApiResponse({ status: 401, description: "Invalid webhook secret." })
  async whatsappWebhook(
    @Body() webhookData: WhatsappWebhookDto,
    @Headers("x-webhook-secret") webhookSecret?: string,
  ) {
    this.logger.log(
      `WhatsApp webhook received - Event: ${webhookData.event}, Session: ${webhookData.session}`,
    );

    const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
    if (expectedSecret && webhookSecret !== expectedSecret) {
      this.logger.warn("Invalid webhook secret received");
      throw new UnauthorizedException("Invalid webhook secret");
    }

    if (!webhookData) {
      this.logger.warn("Empty webhook data received");
      throw new BadRequestException("Webhook data is required");
    }

    if (webhookData.event !== "message") {
      this.logger.log(`Ignoring non-message event: ${webhookData.event}`);
      return { status: "success", message: "Event ignored" };
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
}
