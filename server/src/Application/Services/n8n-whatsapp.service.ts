import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class N8NWhatsappService {
  private readonly logger = new Logger(N8NWhatsappService.name);
  private readonly n8nBaseUrl =
    process.env.N8N_BASE_URL || "http://localhost:5678";

  constructor() {}

  async createSession(sessionId: string, tenantId: string): Promise<any> {
    this.logger.log(`Creating WhatsApp session: ${sessionId}`);

    try {
      const response = await axios.post(
        `${this.n8nBaseUrl}/webhook/whatsapp/session`,
        {
          session_id: sessionId,
          tenant_id: tenantId,
        },
      );

      this.logger.log(`WhatsApp session created successfully: ${sessionId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error creating WhatsApp session: ${error.message}`);
      throw new Error(`Failed to create WhatsApp session: ${error.message}`);
    }
  }

  async getAuthQRCode(sessionId: string): Promise<any> {
    this.logger.log(`Getting QR code for session: ${sessionId}`);

    try {
      const response = await axios.post(
        `${this.n8nBaseUrl}/webhook/whatsapp/auth`,
        {
          session_id: sessionId,
        },
      );

      this.logger.log(
        `QR code retrieved successfully for session: ${sessionId}`,
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error getting QR code: ${error.message}`);
      throw new Error(`Failed to get QR code: ${error.message}`);
    }
  }

  async startSession(sessionId: string): Promise<any> {
    this.logger.log(`Starting WhatsApp session: ${sessionId}`);

    try {
      const response = await axios.post(
        `${this.n8nBaseUrl}/webhook/whatsapp/session/start`,
        {
          session_id: sessionId,
        },
      );

      this.logger.log(`WhatsApp session started successfully: ${sessionId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error starting WhatsApp session: ${error.message}`);
      throw new Error(`Failed to start WhatsApp session: ${error.message}`);
    }
  }

  async sendMessage(
    sessionId: string,
    contact: string,
    message: string,
  ): Promise<any> {
    this.logger.log(
      `Sending WhatsApp message to ${contact} via session ${sessionId}`,
    );

    try {
      const response = await axios.post(
        `${this.n8nBaseUrl}/webhook/whatsapp/sendMessage`,
        {
          session_id: sessionId,
          contact: contact,
          message: message,
        },
      );

      this.logger.log(`WhatsApp message sent successfully to ${contact}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error sending WhatsApp message: ${error.message}`);
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }
}
