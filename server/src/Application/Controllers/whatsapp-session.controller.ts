import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";

@ApiTags("WhatsApp Session Management")
@Controller("whatsapp")
export class WhatsappSessionController {
  private readonly logger = new Logger(WhatsappSessionController.name);

  constructor(private readonly n8nWhatsappService: N8NWhatsappService) {}

  @Post("session")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Create WhatsApp Session",
    description:
      "Creates a session if not exists, starts it if exists. Returns QR code for validation if not yet authenticated.",
  })
  @ApiBody({
    description: "Session creation data",
    schema: {
      type: "object",
      properties: {
        session_id: { type: "string", example: "GUID" },
        tenant_id: { type: "string", example: "GUID" },
      },
      required: ["session_id", "tenant_id"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Session created/started successfully.",
  })
  @ApiResponse({ status: 400, description: "Invalid session data." })
  async createSession(
    @Body() sessionData: { session_id: string; tenant_id: string },
  ) {
    this.logger.log(`Creating WhatsApp session: ${sessionData.session_id}`);

    if (!sessionData.session_id || !sessionData.tenant_id) {
      throw new BadRequestException("session_id and tenant_id are required");
    }

    try {
      const result = await this.n8nWhatsappService.createSession(
        sessionData.session_id,
        sessionData.tenant_id,
      );
      return result;
    } catch (error: any) {
      this.logger.error(`Error creating session: ${error.message}`);
      throw new BadRequestException(
        `Failed to create session: ${error.message}`,
      );
    }
  }

  @Post("auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get WhatsApp Auth QR Code",
    description: "Gets QR code for phone validation for an existing session.",
  })
  @ApiBody({
    description: "Session authentication data",
    schema: {
      type: "object",
      properties: {
        session_id: { type: "string", example: "GUID" },
      },
      required: ["session_id"],
    },
  })
  @ApiResponse({ status: 200, description: "QR code retrieved successfully." })
  @ApiResponse({ status: 400, description: "Invalid session data." })
  async getAuthQRCode(@Body() authData: { session_id: string }) {
    this.logger.log(`Getting QR code for session: ${authData.session_id}`);

    if (!authData.session_id) {
      throw new BadRequestException("session_id is required");
    }

    try {
      const result = await this.n8nWhatsappService.getAuthQRCode(
        authData.session_id,
      );
      return result;
    } catch (error: any) {
      this.logger.error(`Error getting QR code: ${error.message}`);
      throw new BadRequestException(`Failed to get QR code: ${error.message}`);
    }
  }

  @Post("session/start")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Start WhatsApp Session",
    description:
      "Starts an existing session. Session must exist in database before calling this route.",
  })
  @ApiBody({
    description: "Session start data",
    schema: {
      type: "object",
      properties: {
        session_id: { type: "string", example: "GUID" },
      },
      required: ["session_id"],
    },
  })
  @ApiResponse({ status: 200, description: "Session started successfully." })
  @ApiResponse({ status: 400, description: "Invalid session data." })
  async startSession(@Body() sessionData: { session_id: string }) {
    this.logger.log(`Starting WhatsApp session: ${sessionData.session_id}`);

    if (!sessionData.session_id) {
      throw new BadRequestException("session_id is required");
    }

    try {
      const result = await this.n8nWhatsappService.startSession(
        sessionData.session_id,
      );
      return result;
    } catch (error: any) {
      this.logger.error(`Error starting session: ${error.message}`);
      throw new BadRequestException(
        `Failed to start session: ${error.message}`,
      );
    }
  }

  @Post("sendMessage")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send WhatsApp Message",
    description: "Sends a message via WhatsApp using the specified session.",
  })
  @ApiBody({
    description: "Message data",
    schema: {
      type: "object",
      properties: {
        session_id: { type: "string", example: "GUID" },
        contact: { type: "string", example: "11111111111" },
        message: { type: "string", example: "Hello!" },
      },
      required: ["session_id", "contact", "message"],
    },
  })
  @ApiResponse({ status: 200, description: "Message sent successfully." })
  @ApiResponse({ status: 400, description: "Invalid message data." })
  async sendMessage(
    @Body()
    messageData: {
      session_id: string;
      contact: string;
      message: string;
    },
  ) {
    this.logger.log(`Sending WhatsApp message to ${messageData.contact}`);

    if (
      !messageData.session_id ||
      !messageData.contact ||
      !messageData.message
    ) {
      throw new BadRequestException(
        "session_id, contact, and message are required",
      );
    }

    try {
      const result = await this.n8nWhatsappService.sendMessage(
        messageData.session_id,
        messageData.contact,
        messageData.message,
      );
      return result;
    } catch (error: any) {
      this.logger.error(`Error sending message: ${error.message}`);
      throw new BadRequestException(`Failed to send message: ${error.message}`);
    }
  }
}
