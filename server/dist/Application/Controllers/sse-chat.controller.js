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
var SSEChatController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../Features/auth.guard");
const sse_chat_service_1 = require("../Services/sse-chat.service");
let SSEChatController = SSEChatController_1 = class SSEChatController {
    constructor(sseChatService) {
        this.sseChatService = sseChatService;
        this.logger = new common_1.Logger(SSEChatController_1.name);
    }
    async subscribe(chatId, res, lastMessageDateTime, req = {}) {
        const userId = req.user?.id;
        const userLevel = req.userLevel;
        if (!userId || userLevel < 1) {
            throw new common_1.UnauthorizedException("User authentication required");
        }
        this.logger.log(`User ${userId} subscribing to chat ${chatId}`);
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
        });
        res.write(`data: ${JSON.stringify({ type: "connection", message: "SSE connection established" })}\n\n`);
        const subscription = await this.sseChatService.subscribe(userId, chatId, res, lastMessageDateTime);
        req.on("close", () => {
            this.logger.log(`User ${userId} disconnected from chat ${chatId}`);
            this.sseChatService.unsubscribe(userId);
        });
        const heartbeat = setInterval(() => {
            if (!res.destroyed) {
                res.write(`data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date().toISOString() })}\n\n`);
            }
            else {
                clearInterval(heartbeat);
                this.sseChatService.unsubscribe(userId);
            }
        }, 30000);
    }
    async unsubscribe(req = {}) {
        const userId = req.user?.id;
        const userLevel = req.userLevel;
        if (!userId || userLevel < 1) {
            throw new common_1.UnauthorizedException("User authentication required");
        }
        this.logger.log(`User ${userId} unsubscribing from chat`);
        this.sseChatService.unsubscribe(userId);
        return { message: "Successfully unsubscribed" };
    }
};
exports.SSEChatController = SSEChatController;
__decorate([
    (0, common_1.Get)("subscribe/:chatId"),
    (0, swagger_1.ApiOperation)({ summary: "Subscribe to SSE for real-time chat updates" }),
    (0, swagger_1.ApiParam)({ name: "chatId", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "SSE connection established" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    __param(0, (0, common_1.Param)("chatId")),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)("lastMessageDateTime")),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object]),
    __metadata("design:returntype", Promise)
], SSEChatController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)("unsubscribe"),
    (0, swagger_1.ApiOperation)({ summary: "Unsubscribe from SSE chat updates" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Successfully unsubscribed" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SSEChatController.prototype, "unsubscribe", null);
exports.SSEChatController = SSEChatController = SSEChatController_1 = __decorate([
    (0, swagger_1.ApiTags)("sse-chat"),
    (0, common_1.Controller)("sse-chat"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [sse_chat_service_1.SSEChatService])
], SSEChatController);
//# sourceMappingURL=sse-chat.controller.js.map