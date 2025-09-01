"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FeedbackValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackValidator = void 0;
const common_1 = require("@nestjs/common");
let FeedbackValidator = FeedbackValidator_1 = class FeedbackValidator {
    constructor() {
        this.logger = new common_1.Logger(FeedbackValidator_1.name);
    }
    async validateCreate(createFeedbackDto) {
        this.logger.log("Validating feedback creation");
        if (!createFeedbackDto.chat_id) {
            throw new common_1.BadRequestException("Chat ID is required");
        }
        if (!createFeedbackDto.user_id) {
            throw new common_1.BadRequestException("User ID is required");
        }
        if (createFeedbackDto.user_prompt !== undefined &&
            createFeedbackDto.user_prompt.trim().length === 0) {
            throw new common_1.BadRequestException("User prompt cannot be empty if provided");
        }
        if (createFeedbackDto.message_ids !== undefined) {
            if (!Array.isArray(createFeedbackDto.message_ids)) {
                throw new common_1.BadRequestException("Message IDs must be an array");
            }
            if (createFeedbackDto.message_ids.length > 0) {
                for (const messageId of createFeedbackDto.message_ids) {
                    if (!messageId || typeof messageId !== "string") {
                        throw new common_1.BadRequestException("All message IDs must be valid strings");
                    }
                }
            }
        }
    }
};
exports.FeedbackValidator = FeedbackValidator;
exports.FeedbackValidator = FeedbackValidator = FeedbackValidator_1 = __decorate([
    (0, common_1.Injectable)()
], FeedbackValidator);
//# sourceMappingURL=feedback.validator.js.map