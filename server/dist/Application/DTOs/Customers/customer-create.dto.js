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
exports.CustomerCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const lead_create_dto_1 = require("../Leads/lead-create.dto");
class CustomerCreateDto {
}
exports.CustomerCreateDto = CustomerCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of the person' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary document type',
        enum: ['cpf', 'cnpj', 'rg', 'passport', 'driver_license', 'voter_id', 'work_card', 'other'],
        example: 'cpf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['cpf', 'cnpj', 'rg', 'passport', 'driver_license', 'voter_id', 'work_card', 'other']),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary document number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of customer',
        enum: ['individual', 'company'],
        example: 'individual'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['individual', 'company']),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "customer_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the customer',
        enum: ['active', 'inactive'],
        example: 'active'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['active', 'inactive']),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "customer_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who fidelized this customer', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "fidelized_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional addresses', type: [lead_create_dto_1.AddressDto], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => lead_create_dto_1.AddressDto),
    __metadata("design:type", Array)
], CustomerCreateDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional contacts', type: [lead_create_dto_1.ContactDto], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => lead_create_dto_1.ContactDto),
    __metadata("design:type", Array)
], CustomerCreateDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional documents', type: [lead_create_dto_1.DocumentDto], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => lead_create_dto_1.DocumentDto),
    __metadata("design:type", Array)
], CustomerCreateDto.prototype, "other_documents", void 0);
//# sourceMappingURL=customer-create.dto.js.map