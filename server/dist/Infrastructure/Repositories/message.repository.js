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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const common_1 = require("@nestjs/common");
const main_database_context_1 = require("../Database/main-database.context");
const Message_1 = require("../../Domain/Chat/Message");
let MessageRepository = class MessageRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByChatId(chatId, lastMessageDateTime, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const whereCondition = {
            chat_id: chatId,
            deleted_at: null,
        };
        if (lastMessageDateTime) {
            whereCondition.created_at = {
                gt: lastMessageDateTime,
            };
        }
        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { created_at: "asc" },
            }),
            this.prisma.message.count({
                where: whereCondition,
            }),
        ]);
        return {
            messages: messages.map((message) => new Message_1.Message(message)),
            total,
        };
    }
    async findOne(id) {
        const message = await this.prisma.message.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
        return message ? new Message_1.Message(message) : null;
    }
    async findByMessageId(messageId) {
        const message = await this.prisma.message.findFirst({
            where: {
                message_id: messageId,
                deleted_at: null,
            },
        });
        return message ? new Message_1.Message(message) : null;
    }
    async create(createMessageDto) {
        const message = await this.prisma.message.create({
            data: {
                chat_id: createMessageDto.chat_id,
                user_id: createMessageDto.user_id,
                message_id: createMessageDto.message_id,
                message_direction: createMessageDto.message_direction,
                message_type: createMessageDto.message_type,
                message_content: createMessageDto.message_content,
            },
        });
        return new Message_1.Message(message);
    }
    async createMany(createMessageDtos) {
        const messages = await this.prisma.message.createMany({
            data: createMessageDtos.map((dto) => ({
                chat_id: dto.chat_id,
                user_id: dto.user_id,
                message_id: dto.message_id,
                message_direction: dto.message_direction,
                message_type: dto.message_type,
                message_content: dto.message_content,
            })),
        });
        const createdMessages = await this.prisma.message.findMany({
            where: {
                chat_id: { in: createMessageDtos.map((dto) => dto.chat_id) },
                message_id: { in: createMessageDtos.map((dto) => dto.message_id) },
            },
            orderBy: { created_at: "asc" },
        });
        return createdMessages.map((message) => new Message_1.Message(message));
    }
    async update(id, updateMessageDto) {
        const message = await this.prisma.message.update({
            where: { id },
            data: {
                ...(updateMessageDto.message_content && {
                    message_content: updateMessageDto.message_content,
                }),
                ...(updateMessageDto.message_type && {
                    message_type: updateMessageDto.message_type,
                }),
            },
        });
        return new Message_1.Message(message);
    }
    async remove(id) {
        await this.prisma.message.update({
            where: { id },
            data: {
                deleted_at: new Date(),
                deleted_by: "system",
            },
        });
    }
    async exists(id) {
        const count = await this.prisma.message.count({
            where: {
                id,
                deleted_at: null,
            },
        });
        return count > 0;
    }
    async existsByMessageId(messageId) {
        const count = await this.prisma.message.count({
            where: {
                message_id: messageId,
                deleted_at: null,
            },
        });
        return count > 0;
    }
    async purge(id) {
        await this.prisma.message.delete({
            where: { id },
        });
    }
    async purgeByChat(chatId) {
        await this.prisma.message.deleteMany({
            where: { chat_id: chatId },
        });
    }
};
exports.MessageRepository = MessageRepository;
exports.MessageRepository = MessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [main_database_context_1.MainDatabaseContext])
], MessageRepository);
//# sourceMappingURL=message.repository.js.map