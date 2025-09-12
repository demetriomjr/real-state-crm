import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { CreateFeedbackDto } from "@/Application/DTOs";

@Injectable()
export class FeedbackValidator {
  private readonly logger = new Logger(FeedbackValidator.name);

  async validateCreate(createFeedbackDto: CreateFeedbackDto): Promise<void> {
    this.logger.log("Validating feedback creation");

    if (!createFeedbackDto.chat_id) {
      throw new BadRequestException("Chat ID is required");
    }

    if (!createFeedbackDto.user_id) {
      throw new BadRequestException("User ID is required");
    }

    if (
      createFeedbackDto.user_prompt !== undefined &&
      createFeedbackDto.user_prompt.trim().length === 0
    ) {
      throw new BadRequestException("User prompt cannot be empty if provided");
    }

    if (createFeedbackDto.message_ids !== undefined) {
      if (!Array.isArray(createFeedbackDto.message_ids)) {
        throw new BadRequestException("Message IDs must be an array");
      }

      if (createFeedbackDto.message_ids.length > 0) {
        for (const messageId of createFeedbackDto.message_ids) {
          if (!messageId || typeof messageId !== "string") {
            throw new BadRequestException(
              "All message IDs must be valid strings",
            );
          }
        }
      }
    }
  }
}
