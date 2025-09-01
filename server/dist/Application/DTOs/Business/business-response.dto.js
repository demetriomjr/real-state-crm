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
exports.BusinessResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class BusinessResponseDto {
}
exports.BusinessResponseDto = BusinessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Company name" }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Subscription level" }),
    __metadata("design:type", Number)
], BusinessResponseDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Subscription level description" }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "subscription_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Creation timestamp" }),
    __metadata("design:type", Date)
], BusinessResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who created this record", required: false }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last update timestamp" }),
    __metadata("design:type", Date)
], BusinessResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User who last updated this record",
        required: false,
    }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Deletion timestamp (soft delete)",
        required: false,
    }),
    __metadata("design:type", Date)
], BusinessResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who deleted this record", required: false }),
    __metadata("design:type", String)
], BusinessResponseDto.prototype, "deleted_by", void 0);
//# sourceMappingURL=business-response.dto.js.map