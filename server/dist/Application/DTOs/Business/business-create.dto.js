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
exports.BusinessCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BusinessCreateDto {
}
exports.BusinessCreateDto = BusinessCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Company name", example: "Acme Corporation" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessCreateDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Subscription level (0-10)",
        example: 5,
        required: false,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], BusinessCreateDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Master user full name", example: "John Doe" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessCreateDto.prototype, "master_user_fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Master user username", example: "johndoe" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessCreateDto.prototype, "master_user_username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Master user password", example: "password123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessCreateDto.prototype, "master_user_password", void 0);
//# sourceMappingURL=business-create.dto.js.map