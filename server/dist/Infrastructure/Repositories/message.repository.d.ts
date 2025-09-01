import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Message } from "@/Domain/Chat/Message";
import { CreateMessageDto, UpdateMessageDto } from "@/Application/DTOs";
export declare class MessageRepository {
    private readonly prisma;
    constructor(prisma: MainDatabaseContext);
    findByChatId(chatId: string, lastMessageDateTime?: Date, page?: number, limit?: number): Promise<{
        messages: Message[];
        total: number;
    }>;
    findOne(id: string): Promise<Message | null>;
    findByMessageId(messageId: string): Promise<Message | null>;
    create(createMessageDto: CreateMessageDto): Promise<Message>;
    createMany(createMessageDtos: CreateMessageDto[]): Promise<Message[]>;
    update(id: string, updateMessageDto: UpdateMessageDto): Promise<Message>;
    remove(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    existsByMessageId(messageId: string): Promise<boolean>;
    purge(id: string): Promise<void>;
    purgeByChat(chatId: string): Promise<void>;
}
