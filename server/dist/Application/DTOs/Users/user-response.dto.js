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
exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID (UUID)" }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Full name of the user" }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unique username" }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Creation timestamp" }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who created this record", required: false }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last update timestamp" }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User who last updated this record",
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Deletion timestamp (soft delete)",
        required: false,
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who deleted this record", required: false }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "deleted_by", void 0);
//# sourceMappingURL=user-response.dto.js.map