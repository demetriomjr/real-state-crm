import { Response } from "express";
export declare class SSEChatService {
    private readonly logger;
    private readonly subscriptions;
    private readonly messageCache;
    private readonly timeoutMinutes;
    constructor();
    subscribe(userId: string, chatId: string, response: Response, lastMessageDateTime?: string): Promise<void>;
    unsubscribe(userId: string): void;
    sendMessageToChat(chatId: string, message: any): void;
    private sendMessageToUser;
    private updateLastInteraction;
    private cleanupInactiveSubscriptions;
    getActiveSubscriptions(): number;
    getSubscribersForChat(chatId: string): string[];
}
