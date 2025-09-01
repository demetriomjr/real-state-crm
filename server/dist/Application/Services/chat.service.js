"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_repository_1 = require("../../Infrastructure/Repositories/chat.repository");
const message_repository_1 = require("../../Infrastructure/Repositories/message.repository");
let ChatService = ChatService_1 = class ChatService {
    constructor(chatRepository, messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async findAll(page = 1, limit = 10) {
        this.logger.log(`Fetching chats with pagination: page=${page}, limit=${limit}`);
        const result = await this.chatRepository.findAll(page, limit);
        return {
            chats: result.chats.map((chat) => this.mapChatToResponseDto(chat)),
            total: result.total,
            page,
            limit,
        };
    }
    async findOne(id) {
        this.logger.log(`Fetching chat with ID: ${id}`);
        const chat = await this.chatRepository.findOne(id);
        if (!chat) {
            this.logger.warn(`Chat with ID ${id} not found`);
            throw new common_1.NotFoundException(`Chat with ID ${id} not found`);
        }
        return this.mapChatToResponseDto(chat);
    }
    async create(createChatDto) {
        this.logger.log(`Creating new chat for person: ${createChatDto.person_id}`);
        const chat = await this.chatRepository.create(createChatDto);
        this.logger.log(`Chat created successfully with ID: ${chat.id}`);
        return this.mapChatToResponseDto(chat);
    }
    async update(id, updateChatDto) {
        this.logger.log(`Updating chat with ID: ${id}`);
        const existingChat = await this.chatRepository.findOne(id);
        if (!existingChat) {
            this.logger.warn(`Chat with ID ${id} not found for update`);
            throw new common_1.NotFoundException(`Chat with ID ${id} not found`);
        }
        const chat = await this.chatRepository.update(id, updateChatDto);
        this.logger.log(`Chat updated successfully with ID: ${chat.id}`);
        return this.mapChatToResponseDto(chat);
    }
    async remove(id) {
        this.logger.log(`Removing chat with ID: ${id}`);
        const existingChat = await this.chatRepository.findOne(id);
        if (!existingChat) {
            this.logger.warn(`Chat with ID ${id} not found for removal`);
            throw new common_1.NotFoundException(`Chat with ID ${id} not found`);
        }
        await this.chatRepository.remove(id);
        this.logger.log(`Chat removed successfully with ID: ${id}`);
    }
    async findMessages(chatId, lastMessageDateTime, page = 1, limit = 50) {
        this.logger.log(`Fetching messages for chat: ${chatId}`);
        const result = await this.messageRepository.findByChatId(chatId, lastMessageDateTime, page, limit);
        return {
            messages: result.messages.map((message) => this.mapMessageToResponseDto(message)),
            total: result.total,
            page,
            limit,
        };
    }
    async createMessage(createMessageDto) {
        this.logger.log(`Creating new message for chat: ${createMessageDto.chat_id}`);
        const chat = await this.chatRepository.findOne(createMessageDto.chat_id);
        if (!chat) {
            this.logger.warn(`Chat with ID ${createMessageDto.chat_id} not found`);
            throw new common_1.NotFoundException(`Chat with ID ${createMessageDto.chat_id} not found`);
        }
        const existingMessage = await this.messageRepository.findByMessageId(createMessageDto.message_id);
        if (existingMessage) {
            this.logger.warn(`Message with ID ${createMessageDto.message_id} already exists`);
            if (existingMessage.message_content !== createMessageDto.message_content) {
                const updatedMessage = await this.messageRepository.update(existingMessage.id, {
                    message_content: createMessageDto.message_content,
                    message_type: createMessageDto.message_type,
                });
                return this.mapMessageToResponseDto(updatedMessage);
            }
            return this.mapMessageToResponseDto(existingMessage);
        }
        const message = await this.messageRepository.create(createMessageDto);
        await this.chatRepository.updateLastMessageAt(createMessageDto.chat_id);
        if (createMessageDto.message_direction === "sent") {
            this.logger.log(`Message would be sent via WhatsApp: ${createMessageDto.message_id}`);
        }
        this.logger.log(`Message created successfully with ID: ${message.id}`);
        return this.mapMessageToResponseDto(message);
    }
    async createMessages(createMessageDtos) {
        this.logger.log(`Creating ${createMessageDtos.length} messages`);
        const messages = await this.messageRepository.createMany(createMessageDtos);
        const uniqueChatIds = [
            ...new Set(createMessageDtos.map((dto) => dto.chat_id)),
        ];
        for (const chatId of uniqueChatIds) {
            await this.chatRepository.updateLastMessageAt(chatId);
        }
        const sentMessages = createMessageDtos.filter((dto) => dto.message_direction === "sent");
        for (const messageDto of sentMessages) {
            this.logger.log(`Message would be sent via WhatsApp: ${messageDto.message_id}`);
        }
        this.logger.log(`${messages.length} messages created successfully`);
        return messages.map((message) => this.mapMessageToResponseDto(message));
    }
    async updateMessage(id, updateMessageDto) {
        this.logger.log(`Updating message with ID: ${id}`);
        const existingMessage = await this.messageRepository.findOne(id);
        if (!existingMessage) {
            this.logger.warn(`Message with ID ${id} not found for update`);
            throw new common_1.NotFoundException(`Message with ID ${id} not found`);
        }
        const message = await this.messageRepository.update(id, updateMessageDto);
        this.logger.log(`Message updated successfully with ID: ${message.id}`);
        return this.mapMessageToResponseDto(message);
    }
    async findByPersonId(personId) {
        this.logger.log(`Fetching chat by person ID: ${personId}`);
        const chat = await this.chatRepository.findByPersonId(personId);
        return chat ? this.mapChatToResponseDto(chat) : null;
    }
    async findByPhone(phone) {
        this.logger.log(`Fetching chat by phone: ${phone}`);
        const chat = await this.chatRepository.findByPhone(phone);
        return chat ? this.mapChatToResponseDto(chat) : null;
    }
    async findByMessageId(messageId) {
        this.logger.log(`Fetching message by message ID: ${messageId}`);
        const message = await this.messageRepository.findByMessageId(messageId);
        return message ? this.mapMessageToResponseDto(message) : null;
    }
    async purge(id) {
        this.logger.warn(`PURGING chat with ID: ${id} - PERMANENT DELETION`);
        const existingChat = await this.chatRepository.findOne(id);
        if (!existingChat) {
            this.logger.warn(`Chat with ID ${id} not found for purge`);
            throw new common_1.NotFoundException(`Chat with ID ${id} not found`);
        }
        await this.messageRepository.purgeByChat(id);
        await this.chatRepository.purge(id);
        this.logger.warn(`Chat PURGED permanently with ID: ${id}`);
    }
    mapChatToResponseDto(chat) {
        return {
            id: chat.id,
            person_id: chat.person_id,
            contact_name: chat.contact_name,
            contact_phone: chat.contact_phone,
            user_observations: chat.user_observations,
            session_id: chat.session_id,
            last_message_at: chat.last_message_at,
            created_at: chat.created_at,
            updated_at: chat.updated_at,
        };
    }
    mapMessageToResponseDto(message) {
        return {
            id: message.id,
            chat_id: message.chat_id,
            user_id: message.user_id,
            message_id: message.message_id,
            message_direction: message.message_direction,
            message_type: message.message_type,
            message_content: message.message_content,
            created_at: message.created_at,
            updated_at: message.updated_at,
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        message_repository_1.MessageRepository])
], ChatService);
//# sourceMappingURL=chat.service.js.map