import { Module } from "@nestjs/common";
import { IntegratedServicesController } from "@/Application/Controllers/integrated-services.controller";
import { ChatMessagingService } from "@/Application/Services/chat-messaging.service";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [IntegratedServicesController],
  providers: [
    ChatMessagingService
  ],
})
export class IntegratedServicesModule {}
