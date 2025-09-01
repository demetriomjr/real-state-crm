export declare class MessageResponseDto {
    id: string;
    chat_id: string;
    user_id?: string;
    message_id: string;
    message_direction: "received" | "sent";
    message_type: "text" | "image" | "audio" | "video" | "file";
    message_content: string;
    created_at: Date;
    updated_at: Date;
}
