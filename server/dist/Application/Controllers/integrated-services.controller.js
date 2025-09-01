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
var IntegratedServicesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegratedServicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_messaging_service_1 = require("../Services/chat-messaging.service");
let IntegratedServicesController = IntegratedServicesController_1 = class IntegratedServicesController {
    constructor(messagingService) {
        this.messagingService = messagingService;
        this.logger = new common_1.Logger(IntegratedServicesController_1.name);
    }
    async whatsappWebhook(webhookData, webhookSecret) {
        this.logger.log("WhatsApp webhook received");
        const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
        if (expectedSecret && webhookSecret !== expectedSecret) {
            this.logger.warn("Invalid webhook secret received");
            throw new common_1.UnauthorizedException("Invalid webhook secret");
        }
        if (!webhookData) {
            this.logger.warn("Empty webhook data received");
            throw new common_1.BadRequestException("Webhook data is required");
        }
        try {
            await this.messagingService.receiveMessage(webhookData);
            return { status: "success", message: "Message processed successfully" };
        }
        catch (error) {
            this.logger.error(`Error processing WhatsApp webhook: ${error.message}`, error.stack);
            throw new common_1.BadRequestException("Error processing webhook data");
        }
    }
    async sendWhatsappMessage(messageData) {
        this.logger.log(`Sending WhatsApp message to chat: ${messageData.chatId}`);
        return this.messagingService.sendMessage(messageData.chatId, messageData.text);
    }
};
exports.IntegratedServicesController = IntegratedServicesController;
__decorate([
    (0, common_1.Post)("whatsapp/webhook"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "WhatsApp Webhook",
        description: "Endpoint for receiving incoming messages and events from n8n/WAHA.",
    }),
    (0, swagger_1.ApiHeader)({
        name: "X-Webhook-Secret",
        description: "Webhook secret for verification.",
        required: true,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Message received successfully." }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid webhook data." }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid webhook secret." }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("x-webhook-secret")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IntegratedServicesController.prototype, "whatsappWebhook", null);
__decorate([
    (0, common_1.Post)("whatsapp/send"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Send WhatsApp Message",
        description: "Sends a message to a specific chat using its associated session (via n8n).",
    }),
    (0, swagger_1.ApiBody)({
        description: "Message data containing the chat ID and text to send.",
        schema: {
            type: "object",
            properties: {
                chatId: { type: "string", example: "your-chat-id" },
                text: { type: "string", example: "Hello from the API!" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Message sent successfully." }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid message data." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegratedServicesController.prototype, "sendWhatsappMessage", null);
exports.IntegratedServicesController = IntegratedServicesController = IntegratedServicesController_1 = __decorate([
    (0, swagger_1.ApiTags)("Integrated Services - WhatsApp"),
    (0, common_1.Controller)("integrated-services"),
    __metadata("design:paramtypes", [chat_messaging_service_1.ChatMessagingService])
], IntegratedServicesController);
//# sourceMappingURL=integrated-services.controller.js.map