import { Module } from "@nestjs/common";
import { WebhooksController } from "@/Application/Controllers/webhooks.controller";
import { ChatMessagingService } from "@/Application/Services/chat-messaging.service";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { ChatRepository } from "@/Infrastructure/Repositories/chat.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { SSEChatService } from "@/Application/Services/sse-chat.service";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [WebhooksController],
  providers: [
    ChatMessagingService,
    N8NWhatsappService,
    WhatsappSessionRepository,
    ChatRepository,
    MessageRepository,
    SSEChatService,
  ],
  exports: [ChatMessagingService, N8NWhatsappService],
})
export class WebhooksModule {}
