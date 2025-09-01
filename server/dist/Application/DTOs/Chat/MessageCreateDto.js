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
exports.MessageCreateDto = void 0;
const class_validator_1 = require("class-validator");
class MessageCreateDto {
}
exports.MessageCreateDto = MessageCreateDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MessageCreateDto.prototype, "chat_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MessageCreateDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MessageCreateDto.prototype, "message_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["received", "sent"]),
    __metadata("design:type", String)
], MessageCreateDto.prototype, "message_direction", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["text", "image", "audio", "video", "file"]),
    __metadata("design:type", String)
], MessageCreateDto.prototype, "message_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MessageCreateDto.prototype, "message_content", void 0);
//# sourceMappingURL=MessageCreateDto.js.map