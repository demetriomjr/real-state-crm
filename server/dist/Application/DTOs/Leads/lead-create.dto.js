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
exports.LeadCreateDto = exports.DocumentDto = exports.ContactDto = exports.AddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AddressDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Address ID (for updates)", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "First line of the address" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "address_line_1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Second line of the address (optional)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "address_line_2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "City name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "State or province" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Country name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ZIP or postal code" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "zip_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "District or neighborhood (optional)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Whether this is the primary address" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AddressDto.prototype, "is_primary", void 0);
class ContactDto {
}
exports.ContactDto = ContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Contact ID (for updates)", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of contact",
        enum: ["email", "phone", "whatsapp", "cellphone"],
        example: "email",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["email", "phone", "whatsapp", "cellphone"]),
    __metadata("design:type", String)
], ContactDto.prototype, "contact_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Contact value (email address, phone number, etc.)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "contact_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Whether this is the primary contact" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ContactDto.prototype, "is_primary", void 0);
class DocumentDto {
}
exports.DocumentDto = DocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Document ID (for updates)", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of document",
        enum: [
            "cpf",
            "cnpj",
            "rg",
            "passport",
            "driver_license",
            "voter_id",
            "work_card",
            "other",
        ],
        example: "cpf",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)([
        "cpf",
        "cnpj",
        "rg",
        "passport",
        "driver_license",
        "voter_id",
        "work_card",
        "other",
    ]),
    __metadata("design:type", String)
], DocumentDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Document number" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Whether this is the primary document" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DocumentDto.prototype, "is_primary", void 0);
class LeadCreateDto {
}
exports.LeadCreateDto = LeadCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Full name of the person" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Primary document type",
        enum: [
            "cpf",
            "cnpj",
            "rg",
            "passport",
            "driver_license",
            "voter_id",
            "work_card",
            "other",
        ],
        example: "cpf",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)([
        "cpf",
        "cnpj",
        "rg",
        "passport",
        "driver_license",
        "voter_id",
        "work_card",
        "other",
    ]),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Primary document number" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Type of lead",
        enum: ["customer", "prospect"],
        example: "customer",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["customer", "prospect"]),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "lead_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Status of the lead",
        enum: ["new", "contacted", "qualified", "won", "lost"],
        example: "new",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["new", "contacted", "qualified", "won", "lost"]),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "lead_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Temperature of the lead",
        enum: ["hot", "warm", "cold"],
        example: "warm",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["hot", "warm", "cold"]),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "lead_temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Origin of the lead",
        enum: ["website", "email", "phone", "whatsapp", "cellphone", "other"],
        example: "website",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["website", "email", "phone", "whatsapp", "cellphone", "other"]),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "lead_origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Description of the lead" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "lead_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Notes about the lead", type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], LeadCreateDto.prototype, "lead_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID of the user who first contacted this lead" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], LeadCreateDto.prototype, "first_contacted_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional addresses",
        type: [AddressDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AddressDto),
    __metadata("design:type", Array)
], LeadCreateDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional contacts",
        type: [ContactDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ContactDto),
    __metadata("design:type", Array)
], LeadCreateDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional documents",
        type: [DocumentDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DocumentDto),
    __metadata("design:type", Array)
], LeadCreateDto.prototype, "other_documents", void 0);
//# sourceMappingURL=lead-create.dto.js.map