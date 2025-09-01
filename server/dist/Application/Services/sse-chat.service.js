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
var SSEChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEChatService = void 0;
const common_1 = require("@nestjs/common");
let SSEChatService = SSEChatService_1 = class SSEChatService {
    constructor() {
        this.logger = new common_1.Logger(SSEChatService_1.name);
        this.subscriptions = new Map();
        this.messageCache = new Map();
        this.timeoutMinutes = parseInt(process.env.SSE_TIMEOUT_MINUTES || "5");
        setInterval(() => {
            this.cleanupInactiveSubscriptions();
        }, 60000);
    }
    async subscribe(userId, chatId, response, lastMessageDateTime) {
        this.logger.log(`User ${userId} subscribing to chat ${chatId}`);
        this.unsubscribe(userId);
        const subscription = {
            userId,
            chatId,
            response,
            lastInteraction: new Date(),
            heartbeat: setInterval(() => {
                this.updateLastInteraction(userId);
            }, 30000),
        };
        this.subscriptions.set(userId, subscription);
        const cachedMessages = this.messageCache.get(chatId) || [];
        if (cachedMessages.length > 0) {
            for (const message of cachedMessages) {
                this.sendMessageToUser(userId, message);
            }
            this.messageCache.delete(chatId);
        }
    }
    unsubscribe(userId) {
        this.logger.log(`User ${userId} unsubscribing from chat`);
        const subscription = this.subscriptions.get(userId);
        if (subscription) {
            if (subscription.heartbeat) {
                clearInterval(subscription.heartbeat);
            }
            if (!subscription.response.destroyed) {
                subscription.response.end();
            }
            this.subscriptions.delete(userId);
        }
    }
    sendMessageToChat(chatId, message) {
        this.logger.log(`Sending message to chat ${chatId}: ${JSON.stringify(message)}`);
        const subscribers = Array.from(this.subscriptions.values()).filter((sub) => sub.chatId === chatId);
        if (subscribers.length === 0) {
            const cachedMessages = this.messageCache.get(chatId) || [];
            cachedMessages.push(message);
            this.messageCache.set(chatId, cachedMessages);
            this.logger.log(`No subscribers for chat ${chatId}, message cached`);
            return;
        }
        for (const subscriber of subscribers) {
            this.sendMessageToUser(subscriber.userId, message);
        }
    }
    sendMessageToUser(userId, message) {
        const subscription = this.subscriptions.get(userId);
        if (!subscription || subscription.response.destroyed) {
            this.logger.warn(`Cannot send message to user ${userId} - subscription not found or response destroyed`);
            return;
        }
        try {
            subscription.response.write(`data: ${JSON.stringify(message)}\n\n`);
            this.updateLastInteraction(userId);
        }
        catch (error) {
            this.logger.error(`Error sending message to user ${userId}: ${error.message}`);
            this.unsubscribe(userId);
        }
    }
    updateLastInteraction(userId) {
        const subscription = this.subscriptions.get(userId);
        if (subscription) {
            subscription.lastInteraction = new Date();
        }
    }
    cleanupInactiveSubscriptions() {
        const now = new Date();
        const timeoutMs = this.timeoutMinutes * 60 * 1000;
        for (const [userId, subscription] of this.subscriptions.entries()) {
            const timeSinceLastInteraction = now.getTime() - subscription.lastInteraction.getTime();
            if (timeSinceLastInteraction > timeoutMs) {
                this.logger.log(`Cleaning up inactive subscription for user ${userId} (inactive for ${this.timeoutMinutes} minutes)`);
                this.unsubscribe(userId);
            }
        }
    }
    getActiveSubscriptions() {
        return this.subscriptions.size;
    }
    getSubscribersForChat(chatId) {
        return Array.from(this.subscriptions.values())
            .filter((sub) => sub.chatId === chatId)
            .map((sub) => sub.userId);
    }
};
exports.SSEChatService = SSEChatService;
exports.SSEChatService = SSEChatService = SSEChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SSEChatService);
//# sourceMappingURL=sse-chat.service.js.map