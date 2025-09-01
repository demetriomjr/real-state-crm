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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("../Services/chat.service");
const DTOs_1 = require("../DTOs");
const auth_guard_1 = require("../Features/auth.guard");
let ChatController = ChatController_1 = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
        this.logger = new common_1.Logger(ChatController_1.name);
    }
    async findAll(page = 1, limit = 10, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.chatService.findAll(page, limit);
    }
    async findOne(id, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.chatService.findOne(id);
    }
    async create(createChatDto, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.chatService.create(createChatDto);
    }
    async update(id, updateChatDto, req = {}) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.chatService.update(id, updateChatDto);
    }
    async remove(id, req = {}) {
        const userLevel = req.userLevel;
        if (userLevel < 10) {
            this.logger.warn(`User with level ${userLevel} attempted to delete chat - access denied`);
            throw new common_1.BadRequestException("Access denied. Developer level (10) required to delete chats.");
        }
        return this.chatService.remove(id);
    }
    async findMessages(id, page = 1, limit = 50, lastMessageDateTime, req = {}) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        const lastMessageDate = lastMessageDateTime
            ? new Date(lastMessageDateTime)
            : undefined;
        return this.chatService.findMessages(id, lastMessageDate, page, limit);
    }
    async createMessages(id, createMessageDtos, req = {}) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        for (const messageDto of createMessageDtos) {
            if (messageDto.chat_id !== id) {
                throw new common_1.BadRequestException("All messages must belong to the specified chat");
            }
        }
        return this.chatService.createMessages(createMessageDtos);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all chats with pagination" }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        required: false,
        description: "Page number (default: 1)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        required: false,
        description: "Items per page (default: 10)",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns paginated list of chats",
        type: [DTOs_1.ChatResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get chat by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns chat details",
        type: DTOs_1.ChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: "Create a new chat" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Chat created successfully",
        type: DTOs_1.ChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTOs_1.CreateChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update chat by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Chat updated successfully",
        type: DTOs_1.ChatResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DTOs_1.UpdateChatDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Soft delete chat by ID (Developer Only)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Chat deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Access denied - Developer level required",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(":id/messages"),
    (0, swagger_1.ApiOperation)({ summary: "Get messages for a chat with pagination" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        required: false,
        description: "Page number (default: 1)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        required: false,
        description: "Items per page (default: 50)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "last_message_datetime",
        required: false,
        description: "Get messages after this datetime",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns paginated list of messages",
        type: [DTOs_1.MessageResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __param(3, (0, common_1.Query)("last_message_datetime")),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findMessages", null);
__decorate([
    (0, common_1.Post)(":id/messages"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: "Create messages for a chat" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Messages created successfully",
        type: [DTOs_1.MessageResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createMessages", null);
exports.ChatController = ChatController = ChatController_1 = __decorate([
    (0, swagger_1.ApiTags)("chats"),
    (0, common_1.Controller)("chats"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map