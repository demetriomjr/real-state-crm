export declare class FeedbackCreateDto {
    chat_id: string;
    user_id: string;
    feedback_type: "positive" | "negative" | "neutral";
    generation_type: "user_prompt" | "ai_suggestion";
    user_prompt?: string;
    message_ids?: string[];
    feedback_content: string;
}
export declare class FeedbackResponseDto {
    id: string;
    chat_id: string;
    user_id: string;
    feedback_type: "positive" | "negative" | "neutral";
    generation_type: "user_prompt" | "ai_suggestion";
    user_prompt?: string;
    feedback_content: string;
    created_at: Date;
    updated_at: Date;
}
