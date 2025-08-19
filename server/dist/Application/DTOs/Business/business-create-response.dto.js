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
exports.BusinessCreateResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const business_response_dto_1 = require("./business-response.dto");
const authorization_response_dto_1 = require("../Authorization/authorization-response.dto");
class BusinessCreateResponseDto {
}
exports.BusinessCreateResponseDto = BusinessCreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business information', type: business_response_dto_1.BusinessResponseDto }),
    __metadata("design:type", business_response_dto_1.BusinessResponseDto)
], BusinessCreateResponseDto.prototype, "business", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Master user information' }),
    __metadata("design:type", Object)
], BusinessCreateResponseDto.prototype, "master_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Authentication token for the master user', type: authorization_response_dto_1.AuthorizationResponseDto }),
    __metadata("design:type", authorization_response_dto_1.AuthorizationResponseDto)
], BusinessCreateResponseDto.prototype, "auth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success message' }),
    __metadata("design:type", String)
], BusinessCreateResponseDto.prototype, "message", void 0);
//# sourceMappingURL=business-create-response.dto.js.map