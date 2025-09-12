import { Module } from "@nestjs/common";
import { SSEChatController } from "../Controllers/sse-chat.controller";
import { SSEChatService } from "../Services/sse-chat.service";

@Module({
  controllers: [SSEChatController],
  providers: [SSEChatService],
  exports: [SSEChatService],
})
export class SSEChatModule {}
