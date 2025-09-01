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
exports.CustomerResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const lead_response_dto_1 = require("../Leads/lead-response.dto");
class CustomerResponseDto {
}
exports.CustomerResponseDto = CustomerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Customer ID" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Type of customer" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "customer_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Status of the customer" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "customer_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID of the user who fidelized this customer" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "fidelized_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Person ID" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "person_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Full name of the person" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Primary document type" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Primary document number" }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional addresses",
        type: [lead_response_dto_1.AddressResponseDto],
    }),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional contacts",
        type: [lead_response_dto_1.ContactResponseDto],
    }),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Additional documents",
        type: [lead_response_dto_1.DocumentResponseDto],
    }),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "other_documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Creation timestamp" }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who created this record", required: false }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last update timestamp" }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User who last updated this record",
        required: false,
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Deletion timestamp (soft delete)",
        required: false,
    }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who deleted this record", required: false }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "deleted_by", void 0);
//# sourceMappingURL=customer-response.dto.js.map