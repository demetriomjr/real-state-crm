import { ChatService } from "@/Application/Services/chat.service";
import { CreateChatDto, UpdateChatDto, ChatResponseDto, CreateMessageDto, MessageResponseDto } from "@/Application/DTOs";
export declare class ChatController {
    private readonly chatService;
    private readonly logger;
    constructor(chatService: ChatService);
    findAll(page: number, limit: number, req: any): Promise<{
        chats: ChatResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, req: any): Promise<ChatResponseDto>;
    create(createChatDto: CreateChatDto, req: any): Promise<ChatResponseDto>;
    update(id: string, updateChatDto: UpdateChatDto, req?: any): Promise<ChatResponseDto>;
    remove(id: string, req?: any): Promise<void>;
    findMessages(id: string, page?: number, limit?: number, lastMessageDateTime?: string, req?: any): Promise<{
        messages: MessageResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    createMessages(id: string, createMessageDtos: CreateMessageDto[], req?: any): Promise<MessageResponseDto[]>;
}
