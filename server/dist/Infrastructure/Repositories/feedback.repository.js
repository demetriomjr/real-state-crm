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
exports.FeedbackRepository = void 0;
const common_1 = require("@nestjs/common");
const main_database_context_1 = require("../Database/main-database.context");
const Feedback_1 = require("../../Domain/Chat/Feedback");
let FeedbackRepository = class FeedbackRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [feedbacks, total] = await Promise.all([
            this.prisma.feedback.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
            }),
            this.prisma.feedback.count({
                where: { deleted_at: null },
            }),
        ]);
        return {
            feedbacks: feedbacks.map((feedback) => new Feedback_1.Feedback(feedback)),
            total,
        };
    }
    async findOne(id) {
        const feedback = await this.prisma.feedback.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
        return feedback ? new Feedback_1.Feedback(feedback) : null;
    }
    async findByChatId(chatId) {
        const feedbacks = await this.prisma.feedback.findMany({
            where: {
                chat_id: chatId,
                deleted_at: null,
            },
            orderBy: { created_at: "desc" },
        });
        return feedbacks.map((feedback) => new Feedback_1.Feedback(feedback));
    }
    async create(createFeedbackDto) {
        const feedback = await this.prisma.feedback.create({
            data: {
                chat_id: createFeedbackDto.chat_id,
                user_id: createFeedbackDto.user_id,
                feedback_type: createFeedbackDto.feedback_type,
                generation_type: createFeedbackDto.generation_type,
                user_prompt: createFeedbackDto.user_prompt,
                feedback_content: createFeedbackDto.feedback_content,
            },
        });
        return new Feedback_1.Feedback(feedback);
    }
    async exists(id) {
        const count = await this.prisma.feedback.count({
            where: {
                id,
                deleted_at: null,
            },
        });
        return count > 0;
    }
    async purge(id) {
        await this.prisma.feedback.delete({
            where: { id },
        });
    }
    async purgeByChat(chatId) {
        await this.prisma.feedback.deleteMany({
            where: { chat_id: chatId },
        });
    }
};
exports.FeedbackRepository = FeedbackRepository;
exports.FeedbackRepository = FeedbackRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [main_database_context_1.MainDatabaseContext])
], FeedbackRepository);
//# sourceMappingURL=feedback.repository.js.map