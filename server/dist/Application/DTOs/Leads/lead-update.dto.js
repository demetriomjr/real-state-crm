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
exports.LeadUpdateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const lead_create_dto_1 = require("./lead-create.dto");
class LeadUpdateDto {
}
exports.LeadUpdateDto = LeadUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Full name of the person", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Primary document type", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Primary document number", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of lead",
        enum: ["customer", "prospect"],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["customer", "prospect"]),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "lead_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Status of the lead",
        enum: ["new", "contacted", "qualified", "won", "lost"],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["new", "contacted", "qualified", "won", "lost"]),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "lead_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Temperature of the lead",
        enum: ["hot", "warm", "cold"],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["hot", "warm", "cold"]),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "lead_temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Origin of the lead",
        enum: ["website", "email", "phone", "whatsapp", "cellphone", "other"],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["website", "email", "phone", "whatsapp", "cellphone", "other"]),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "lead_origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Description of the lead", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "lead_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Notes about the lead",
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], LeadUpdateDto.prototype, "lead_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "ID of the user who first contacted this lead",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], LeadUpdateDto.prototype, "first_contacted_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional addresses",
        type: [lead_create_dto_1.AddressDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => lead_create_dto_1.AddressDto),
    __metadata("design:type", Array)
], LeadUpdateDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional contacts",
        type: [lead_create_dto_1.ContactDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => lead_create_dto_1.ContactDto),
    __metadata("design:type", Array)
], LeadUpdateDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional documents",
        type: [lead_create_dto_1.DocumentDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => lead_create_dto_1.DocumentDto),
    __metadata("design:type", Array)
], LeadUpdateDto.prototype, "other_documents", void 0);
//# sourceMappingURL=lead-update.dto.js.map