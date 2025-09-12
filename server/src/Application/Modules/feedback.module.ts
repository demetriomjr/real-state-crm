import { Module } from "@nestjs/common";
import { FeedbackController } from "../Controllers/feedback.controller";
import { FeedbackService } from "../Services/feedback.service";
import { FeedbackRepository } from "@/Infrastructure/Repositories/feedback.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { FeedbackValidator } from "../Validators/feedback.validator";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    FeedbackRepository,
    MessageRepository,
    FeedbackValidator,
  ],
  exports: [FeedbackService, FeedbackRepository],
})
export class FeedbackModule {}
