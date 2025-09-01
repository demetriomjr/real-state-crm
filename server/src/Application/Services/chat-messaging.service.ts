import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ChatMessagingService {
  private readonly logger = new Logger(ChatMessagingService.name);

  constructor() {}

  async sendMessage(chatId: string, text: string): Promise<any> {
    this.logger.log(`Sending message to chat ${chatId}: ${text}`);
    
    try {
      const n8nUrl = process.env.N8N_BASE_URL || "http://localhost:5678";
      const response = await axios.post(`${n8nUrl}/webhook/send-message`, {
        sessionId: "default-session", // TODO: Get from chat
        chatId: chatId,
        text,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Error sending message via n8n: ${error.message}`,
        error.stack,
      );
      throw new Error("Error sending message via n8n");
    }
  }

  async receiveMessage(whatsappData: any): Promise<void> {
    this.logger.log(
      `Receiving WhatsApp message: ${JSON.stringify(whatsappData)}`,
    );

    // TODO: Implement full message processing with repositories
    this.logger.log("Message received and logged (full processing TODO)");
  }
}
