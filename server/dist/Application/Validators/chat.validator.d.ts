import { CreateChatDto, UpdateChatDto, CreateMessageDto, UpdateMessageDto } from "@/Application/DTOs";
export declare class ChatValidator {
    private readonly logger;
    validateCreate(createChatDto: CreateChatDto): Promise<void>;
    validateUpdate(updateChatDto: UpdateChatDto): Promise<void>;
    validateMessageCreate(createMessageDto: CreateMessageDto): Promise<void>;
    validateMessageUpdate(updateMessageDto: UpdateMessageDto): Promise<void>;
}
