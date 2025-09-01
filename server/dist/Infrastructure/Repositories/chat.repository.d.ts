import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Chat } from "@/Domain/Chat/Chat";
import { CreateChatDto, UpdateChatDto } from "@/Application/DTOs";
export declare class ChatRepository {
    private readonly prisma;
    constructor(prisma: MainDatabaseContext);
    findAll(page?: number, limit?: number): Promise<{
        chats: Chat[];
        total: number;
    }>;
    findOne(id: string): Promise<Chat | null>;
    findByPersonId(personId: string): Promise<Chat | null>;
    findByPhone(phone: string): Promise<Chat | null>;
    create(createChatDto: CreateChatDto): Promise<Chat>;
    update(id: string, updateChatDto: UpdateChatDto): Promise<Chat>;
    updateLastMessageAt(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    purge(id: string): Promise<void>;
}
