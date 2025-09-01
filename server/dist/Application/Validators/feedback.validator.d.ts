import { CreateFeedbackDto } from "@/Application/DTOs";
export declare class FeedbackValidator {
    private readonly logger;
    validateCreate(createFeedbackDto: CreateFeedbackDto): Promise<void>;
}
