import { ChatMessagingService } from "@/Application/Services/chat-messaging.service";
export declare class IntegratedServicesController {
    private readonly messagingService;
    private readonly logger;
    constructor(messagingService: ChatMessagingService);
    whatsappWebhook(webhookData: any, webhookSecret?: string): Promise<{
        status: string;
        message: string;
    }>;
    sendWhatsappMessage(messageData: {
        chatId: string;
        text: string;
    }): Promise<any>;
}
