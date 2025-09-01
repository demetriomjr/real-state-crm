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
var ChatMessagingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessagingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let ChatMessagingService = ChatMessagingService_1 = class ChatMessagingService {
    constructor() {
        this.logger = new common_1.Logger(ChatMessagingService_1.name);
    }
    async sendMessage(chatId, text) {
        this.logger.log(`Sending message to chat ${chatId}: ${text}`);
        try {
            const n8nUrl = process.env.N8N_BASE_URL || "http://localhost:5678";
            const response = await axios_1.default.post(`${n8nUrl}/webhook/send-message`, {
                sessionId: "default-session",
                chatId: chatId,
                text,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error sending message via n8n: ${error.message}`, error.stack);
            throw new Error("Error sending message via n8n");
        }
    }
    async receiveMessage(whatsappData) {
        this.logger.log(`Receiving WhatsApp message: ${JSON.stringify(whatsappData)}`);
        this.logger.log("Message received and logged (full processing TODO)");
    }
};
exports.ChatMessagingService = ChatMessagingService;
exports.ChatMessagingService = ChatMessagingService = ChatMessagingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChatMessagingService);
//# sourceMappingURL=chat-messaging.service.js.map