import { Injectable, Logger } from "@nestjs/common";
import { N8NWhatsappService } from "./n8n-whatsapp.service";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { ChatRepository } from "@/Infrastructure/Repositories/chat.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { SSEChatService } from "./sse-chat.service";
import { WhatsappWebhookDto } from "@/Application/DTOs/Chat/WhatsappWebhookDto";

@Injectable()
export class ChatMessagingService {
  private readonly logger = new Logger(ChatMessagingService.name);

  constructor(
    private readonly n8nWhatsappService: N8NWhatsappService,
    private readonly whatsappSessionRepository: WhatsappSessionRepository,
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly sseChatService: SSEChatService,
  ) {}

  async sendMessage(
    chatId: string,
    text: string,
    sessionName: string = "default",
  ): Promise<any> {
    this.logger.log(`Sending message to chat ${chatId}: ${text}`);

    try {
      const result = await this.n8nWhatsappService.sendMessage(
        sessionName,
        chatId,
        text,
      );
      this.logger.log(`Message sent successfully via N8N`);
      return result;
    } catch (error: any) {
      this.logger.error(
        `Error sending message via N8N: ${error.message}`,
        error.stack,
      );
      throw new Error("Failed to send message via N8N");
    }
  }

  async receiveMessage(webhookData: WhatsappWebhookDto): Promise<void> {
    this.logger.log(
      `Processing WhatsApp webhook - Session: ${webhookData.session}, Event: ${webhookData.event}`,
    );

    try {
      const sessionName = webhookData.session;
      const contactPhone = this.extractPhoneNumber(webhookData.payload.from);
      const messageContent = webhookData.payload.body;
      const contactName = webhookData.me.pushName;

      if (!sessionName || !contactPhone || !messageContent) {
        this.logger.warn("Invalid webhook data: missing required fields");
        return;
      }

      const whatsappSession =
        await this.whatsappSessionRepository.findByName(sessionName);
      if (!whatsappSession) {
        this.logger.warn(
          `WhatsappSession not found for session name: ${sessionName}`,
        );
        return;
      }

      let chat = await this.chatRepository.findByPhone(contactPhone);
      if (!chat) {
        const chatCreateDto = {
          session_id: whatsappSession.id,
          contact_name: contactName,
          contact_phone: contactPhone,
          user_observations: null,
        };
        chat = await this.chatRepository.create(chatCreateDto);
        this.logger.log(
          `Created new chat for contact: ${contactPhone} (${contactName})`,
        );
      }

      const messageType = this.determineMessageType(webhookData.payload);
      const messageCreateDto = {
        chat_id: chat.id,
        message_id: webhookData.payload.id,
        message_direction: (webhookData.payload.fromMe ? "sent" : "received") as "sent" | "received",
        message_type: messageType,
        message_content: this.formatMessageContent(
          webhookData.payload,
          messageType,
        ),
      };

      const message = await this.messageRepository.create(messageCreateDto);
      await this.chatRepository.updateLastMessageAt(chat.id);

      this.logger.log(
        `Message saved successfully for chat: ${chat.id} - Type: ${messageType}`,
      );

      this.sseChatService.sendMessageToChat(chat.id, {
        type: "new_message",
        message: message,
        chatId: chat.id,
        timestamp: new Date().toISOString(),
        webhookData: {
          session: sessionName,
          contactName: contactName,
          hasMedia: webhookData.payload.hasMedia,
          messageType: messageType,
        },
      });

    } catch (error: any) {
      this.logger.error(
        `Error processing WhatsApp webhook: ${error.message}`,
        error.stack,
      );
    }
  }

  private extractPhoneNumber(fromAddress: string): string {
    return fromAddress.replace("@c.us", "");
  }

  private determineMessageType(
    payload: any,
  ): "text" | "image" | "audio" | "video" | "file" {
    if (payload.hasMedia && payload.media) {
      const mimetype = payload.media.mimetype || "";

      if (mimetype.startsWith("image/")) {
        return "image";
      } else if (mimetype.startsWith("audio/")) {
        return "audio";
      } else if (mimetype.startsWith("video/")) {
        return "video";
      } else {
        return "file";
      }
    }

    return "text";
  }

  private formatMessageContent(payload: any, messageType: string): string {
    if (messageType === "text") {
      return payload.body;
    }

    if (payload.hasMedia && payload.media) {
      const mediaInfo = {
        type: messageType,
        filename: payload.media.filename,
        mimetype: payload.media.mimetype,
        url: payload.media.url,
      };

      if (payload.media.s3) {
        mediaInfo["s3"] = payload.media.s3;
      }

      return JSON.stringify(mediaInfo);
    }

    return payload.body;
  }
}