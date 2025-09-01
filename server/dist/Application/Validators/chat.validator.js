"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ChatValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatValidator = void 0;
const common_1 = require("@nestjs/common");
let ChatValidator = ChatValidator_1 = class ChatValidator {
    constructor() {
        this.logger = new common_1.Logger(ChatValidator_1.name);
    }
    async validateCreate(createChatDto) {
        this.logger.log("Validating chat creation");
        if (!createChatDto.person_id) {
            throw new common_1.BadRequestException("Person ID is required");
        }
        if (!createChatDto.contact_name ||
            createChatDto.contact_name.trim().length === 0) {
            throw new common_1.BadRequestException("Contact name is required");
        }
        if (!createChatDto.contact_phone ||
            createChatDto.contact_phone.trim().length === 0) {
            throw new common_1.BadRequestException("Contact phone is required");
        }
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(createChatDto.contact_phone)) {
            throw new common_1.BadRequestException("Invalid phone number format");
        }
    }
    async validateUpdate(updateChatDto) {
        this.logger.log("Validating chat update");
        if (updateChatDto.contact_name !== undefined &&
            updateChatDto.contact_name.trim().length === 0) {
            throw new common_1.BadRequestException("Contact name cannot be empty");
        }
        if (updateChatDto.contact_phone !== undefined) {
            if (updateChatDto.contact_phone.trim().length === 0) {
                throw new common_1.BadRequestException("Contact phone cannot be empty");
            }
            const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(updateChatDto.contact_phone)) {
                throw new common_1.BadRequestException("Invalid phone number format");
            }
        }
    }
    async validateMessageCreate(createMessageDto) {
        this.logger.log("Validating message creation");
        if (!createMessageDto.chat_id) {
            throw new common_1.BadRequestException("Chat ID is required");
        }
        if (!createMessageDto.message_id) {
            throw new common_1.BadRequestException("Message ID is required");
        }
        if (!createMessageDto.message_direction) {
            throw new common_1.BadRequestException("Message direction is required");
        }
        if (!["received", "sent"].includes(createMessageDto.message_direction)) {
            throw new common_1.BadRequestException('Message direction must be either "received" or "sent"');
        }
        if (!createMessageDto.message_type) {
            throw new common_1.BadRequestException("Message type is required");
        }
        if (!["text", "image", "audio", "video", "file"].includes(createMessageDto.message_type)) {
            throw new common_1.BadRequestException("Message type must be one of: text, image, audio, video, file");
        }
        if (!createMessageDto.message_content ||
            createMessageDto.message_content.trim().length === 0) {
            throw new common_1.BadRequestException("Message content is required");
        }
    }
    async validateMessageUpdate(updateMessageDto) {
        this.logger.log("Validating message update");
        if (updateMessageDto.message_content !== undefined &&
            updateMessageDto.message_content.trim().length === 0) {
            throw new common_1.BadRequestException("Message content cannot be empty");
        }
        if (updateMessageDto.message_type !== undefined &&
            !["text", "image", "audio", "video", "file"].includes(updateMessageDto.message_type)) {
            throw new common_1.BadRequestException("Message type must be one of: text, image, audio, video, file");
        }
    }
};
exports.ChatValidator = ChatValidator;
exports.ChatValidator = ChatValidator = ChatValidator_1 = __decorate([
    (0, common_1.Injectable)()
], ChatValidator);
//# sourceMappingURL=chat.validator.js.map