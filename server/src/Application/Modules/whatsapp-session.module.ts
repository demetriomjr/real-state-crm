import { Module } from "@nestjs/common";
import { WhatsappSessionController } from "@/Application/Controllers/whatsapp-session.controller";
import { WhatsappSessionService } from "@/Application/Services/whatsapp-session.service";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [WhatsappSessionController],
  providers: [WhatsappSessionService, WhatsappSessionRepository],
  exports: [WhatsappSessionService, WhatsappSessionRepository],
})
export class WhatsappSessionModule {}
