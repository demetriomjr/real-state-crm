import { Module } from "@nestjs/common";
import { WhatsappSessionController } from "@/Application/Controllers/whatsapp-session.controller";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [WhatsappSessionController],
  providers: [WhatsappSessionRepository, N8NWhatsappService],
  exports: [WhatsappSessionRepository, N8NWhatsappService],
})
export class WhatsappSessionModule {}
