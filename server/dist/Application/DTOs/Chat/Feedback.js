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
exports.FeedbackResponseDto = exports.FeedbackCreateDto = void 0;
const class_validator_1 = require("class-validator");
class FeedbackCreateDto {
}
exports.FeedbackCreateDto = FeedbackCreateDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "chat_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["positive", "negative", "neutral"]),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "feedback_type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["user_prompt", "ai_suggestion"]),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "generation_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "user_prompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FeedbackCreateDto.prototype, "message_ids", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "feedback_content", void 0);
class FeedbackResponseDto {
}
exports.FeedbackResponseDto = FeedbackResponseDto;
//# sourceMappingURL=Feedback.js.map