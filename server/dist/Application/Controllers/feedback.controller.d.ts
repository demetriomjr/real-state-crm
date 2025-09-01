import { FeedbackService } from "@/Application/Services/feedback.service";
import { CreateFeedbackDto, FeedbackResponseDto } from "@/Application/DTOs";
export declare class FeedbackController {
    private readonly feedbackService;
    private readonly logger;
    constructor(feedbackService: FeedbackService);
    findAll(page: number, limit: number, req: any): Promise<{
        feedbacks: FeedbackResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, req: any): Promise<FeedbackResponseDto>;
    findByChatId(chatId: string, req: any): Promise<FeedbackResponseDto[]>;
    create(createFeedbackDto: CreateFeedbackDto, req: any): Promise<FeedbackResponseDto>;
}
