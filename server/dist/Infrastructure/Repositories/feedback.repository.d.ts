import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Feedback } from "@/Domain/Chat/Feedback";
import { CreateFeedbackDto } from "@/Application/DTOs";
export declare class FeedbackRepository {
    private readonly prisma;
    constructor(prisma: MainDatabaseContext);
    findAll(page?: number, limit?: number): Promise<{
        feedbacks: Feedback[];
        total: number;
    }>;
    findOne(id: string): Promise<Feedback | null>;
    findByChatId(chatId: string): Promise<Feedback[]>;
    create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback>;
    exists(id: string): Promise<boolean>;
    purge(id: string): Promise<void>;
    purgeByChat(chatId: string): Promise<void>;
}
