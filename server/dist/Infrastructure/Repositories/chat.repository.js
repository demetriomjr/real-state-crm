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
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const main_database_context_1 = require("../Database/main-database.context");
const Chat_1 = require("../../Domain/Chat/Chat");
let ChatRepository = class ChatRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [chats, total] = await Promise.all([
            this.prisma.chat.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { last_message_at: "desc" },
                include: {
                    messages: {
                        where: { deleted_at: null },
                        orderBy: { created_at: "desc" },
                        take: 1,
                    },
                },
            }),
            this.prisma.chat.count({
                where: { deleted_at: null },
            }),
        ]);
        return {
            chats: chats.map((chat) => new Chat_1.Chat(chat)),
            total,
        };
    }
    async findOne(id) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id,
                deleted_at: null,
            },
            include: {
                messages: {
                    where: { deleted_at: null },
                    orderBy: { created_at: "asc" },
                },
            },
        });
        return chat ? new Chat_1.Chat(chat) : null;
    }
    async findByPersonId(personId) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                person_id: personId,
                deleted_at: null,
            },
        });
        return chat ? new Chat_1.Chat(chat) : null;
    }
    async findByPhone(phone) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                contact_phone: phone,
                deleted_at: null,
            },
        });
        return chat ? new Chat_1.Chat(chat) : null;
    }
    async create(createChatDto) {
        const chat = await this.prisma.chat.create({
            data: {
                person_id: createChatDto.person_id,
                contact_name: createChatDto.contact_name,
                contact_phone: createChatDto.contact_phone,
                user_observations: createChatDto.user_observations,
                session_id: createChatDto.session_id,
                last_message_at: new Date(),
            },
        });
        return new Chat_1.Chat(chat);
    }
    async update(id, updateChatDto) {
        const chat = await this.prisma.chat.update({
            where: { id },
            data: {
                ...(updateChatDto.contact_name && {
                    contact_name: updateChatDto.contact_name,
                }),
                ...(updateChatDto.contact_phone && {
                    contact_phone: updateChatDto.contact_phone,
                }),
                ...(updateChatDto.user_observations && {
                    user_observations: updateChatDto.user_observations,
                }),
                ...(updateChatDto.last_message_at && {
                    last_message_at: updateChatDto.last_message_at,
                }),
                ...(updateChatDto.session_id && {
                    session_id: updateChatDto.session_id,
                }),
            },
        });
        return new Chat_1.Chat(chat);
    }
    async updateLastMessageAt(id) {
        await this.prisma.chat.update({
            where: { id },
            data: {
                last_message_at: new Date(),
            },
        });
    }
    async remove(id) {
        await this.prisma.chat.update({
            where: { id },
            data: {
                deleted_at: new Date(),
                deleted_by: "system",
            },
        });
    }
    async exists(id) {
        const count = await this.prisma.chat.count({
            where: {
                id,
                deleted_at: null,
            },
        });
        return count > 0;
    }
    async purge(id) {
        await this.prisma.chat.delete({
            where: { id },
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [main_database_context_1.MainDatabaseContext])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map