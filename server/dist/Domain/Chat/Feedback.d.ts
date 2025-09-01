import { IAudit } from "../Interfaces/IAudit";
export declare class Feedback implements IAudit {
    id: string;
    chat_id: string;
    user_id: string;
    feedback_type: "positive" | "negative" | "neutral";
    generation_type: "user_prompt" | "ai_suggestion";
    user_prompt?: string;
    feedback_content: string;
    tenant_id: string;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Feedback>);
}
