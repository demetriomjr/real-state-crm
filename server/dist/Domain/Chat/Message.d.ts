export declare class Message {
    id: string;
    chat_id: string;
    user_id?: string;
    message_id: string;
    message_direction: "received" | "sent";
    message_type: "text" | "image" | "audio" | "video" | "file";
    message_content: string;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: any);
}
