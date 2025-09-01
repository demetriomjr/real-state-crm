import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Feedback } from "@/Domain/Chat/Feedback";
import { CreateFeedbackDto } from "@/Application/DTOs";

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ feedbacks: Feedback[]; total: number }> {
    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.feedback.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      feedbacks: feedbacks.map((feedback) => new Feedback(feedback as any)),
      total,
    };
  }

  async findOne(id: string): Promise<Feedback | null> {
    const feedback = await this.prisma.feedback.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    return feedback ? new Feedback(feedback as any) : null;
  }

  async findByChatId(chatId: string): Promise<Feedback[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: {
        chat_id: chatId,
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
    });

    return feedbacks.map((feedback) => new Feedback(feedback as any));
  }

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = await this.prisma.feedback.create({
      data: {
        chat_id: createFeedbackDto.chat_id,
        user_id: createFeedbackDto.user_id,
        feedback_type: createFeedbackDto.feedback_type,
        generation_type: createFeedbackDto.generation_type,
        user_prompt: createFeedbackDto.user_prompt,
        feedback_content: createFeedbackDto.feedback_content,
      },
    });

    return new Feedback(feedback as any);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.feedback.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  /**
   * PURGE - Permanently delete feedback from database
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purge(id: string): Promise<void> {
    await this.prisma.feedback.delete({
      where: { id },
    });
  }

  /**
   * PURGE BY CHAT - Permanently delete all feedbacks for a specific chat
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purgeByChat(chatId: string): Promise<void> {
    await this.prisma.feedback.deleteMany({
      where: { chat_id: chatId },
    });
  }
}
