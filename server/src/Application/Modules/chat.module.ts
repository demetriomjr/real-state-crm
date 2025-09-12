import { Module } from "@nestjs/common";
import { ChatController } from "../Controllers/chat.controller";
import { ChatService } from "../Services/chat.service";
import { ChatRepository } from "@/Infrastructure/Repositories/chat.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { N8NWhatsappService } from "../Services/n8n-whatsapp.service";
import { ChatValidator } from "../Validators/chat.validator";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatRepository,
    MessageRepository,
    WhatsappSessionRepository,
    N8NWhatsappService,
    ChatValidator,
  ],
  exports: [ChatService, ChatRepository, MessageRepository],
})
export class ChatModule {}
