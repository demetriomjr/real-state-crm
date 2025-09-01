import { Response } from "express";
import { SSEChatService } from "@/Application/Services/sse-chat.service";
export declare class SSEChatController {
    private readonly sseChatService;
    private readonly logger;
    constructor(sseChatService: SSEChatService);
    subscribe(chatId: string, res: Response, lastMessageDateTime?: string, req?: any): Promise<void>;
    unsubscribe(req?: any): Promise<{
        message: string;
    }>;
}
