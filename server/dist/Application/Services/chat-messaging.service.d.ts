export declare class ChatMessagingService {
    private readonly logger;
    constructor();
    sendMessage(chatId: string, text: string): Promise<any>;
    receiveMessage(whatsappData: any): Promise<void>;
}
