import { ChatRepository } from "@/Infrastructure/Repositories/chat.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { CreateChatDto, UpdateChatDto, ChatResponseDto, CreateMessageDto, UpdateMessageDto, MessageResponseDto } from "@/Application/DTOs";
export declare class ChatService {
    private readonly chatRepository;
    private readonly messageRepository;
    private readonly logger;
    constructor(chatRepository: ChatRepository, messageRepository: MessageRepository);
    findAll(page?: number, limit?: number): Promise<{
        chats: ChatResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<ChatResponseDto>;
    create(createChatDto: CreateChatDto): Promise<ChatResponseDto>;
    update(id: string, updateChatDto: UpdateChatDto): Promise<ChatResponseDto>;
    remove(id: string): Promise<void>;
    findMessages(chatId: string, lastMessageDateTime?: Date, page?: number, limit?: number): Promise<{
        messages: MessageResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    createMessage(createMessageDto: CreateMessageDto): Promise<MessageResponseDto>;
    createMessages(createMessageDtos: CreateMessageDto[]): Promise<MessageResponseDto[]>;
    updateMessage(id: string, updateMessageDto: UpdateMessageDto): Promise<MessageResponseDto>;
    findByPersonId(personId: string): Promise<ChatResponseDto | null>;
    findByPhone(phone: string): Promise<ChatResponseDto | null>;
    findByMessageId(messageId: string): Promise<MessageResponseDto | null>;
    purge(id: string): Promise<void>;
    private mapChatToResponseDto;
    private mapMessageToResponseDto;
}
