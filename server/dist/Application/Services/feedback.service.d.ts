import { FeedbackRepository } from "@/Infrastructure/Repositories/feedback.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { CreateFeedbackDto, FeedbackResponseDto } from "@/Application/DTOs";
export declare class FeedbackService {
    private readonly feedbackRepository;
    private readonly messageRepository;
    private readonly logger;
    constructor(feedbackRepository: FeedbackRepository, messageRepository: MessageRepository);
    findAll(page?: number, limit?: number): Promise<{
        feedbacks: FeedbackResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<FeedbackResponseDto>;
    findByChatId(chatId: string): Promise<FeedbackResponseDto[]>;
    create(createFeedbackDto: CreateFeedbackDto): Promise<FeedbackResponseDto>;
    private generateAIFeedback;
    private analyzeFeedbackType;
    purge(id: string): Promise<void>;
    purgeByChat(chatId: string): Promise<void>;
    private mapToResponseDto;
}
