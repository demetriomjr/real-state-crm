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
exports.LeadResponseDto = exports.DocumentResponseDto = exports.ContactResponseDto = exports.AddressResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AddressResponseDto {
}
exports.AddressResponseDto = AddressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address ID' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First line of the address' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "address_line_1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Second line of the address' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "address_line_2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City name' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State or province' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country name' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ZIP or postal code' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "zip_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'District or neighborhood' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary address' }),
    __metadata("design:type", Boolean)
], AddressResponseDto.prototype, "is_primary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created this record', required: false }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who last updated this record', required: false }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deletion timestamp (soft delete)', required: false }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who deleted this record', required: false }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "deleted_by", void 0);
class ContactResponseDto {
}
exports.ContactResponseDto = ContactResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact ID' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of contact' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "contact_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact value' }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "contact_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary contact' }),
    __metadata("design:type", Boolean)
], ContactResponseDto.prototype, "is_primary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ContactResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created this record', required: false }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], ContactResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who last updated this record', required: false }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deletion timestamp (soft delete)', required: false }),
    __metadata("design:type", Date)
], ContactResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who deleted this record', required: false }),
    __metadata("design:type", String)
], ContactResponseDto.prototype, "deleted_by", void 0);
class DocumentResponseDto {
}
exports.DocumentResponseDto = DocumentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document ID' }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of document' }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document number' }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary document' }),
    __metadata("design:type", Boolean)
], DocumentResponseDto.prototype, "is_primary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], DocumentResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created this record', required: false }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], DocumentResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who last updated this record', required: false }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deletion timestamp (soft delete)', required: false }),
    __metadata("design:type", Date)
], DocumentResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who deleted this record', required: false }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "deleted_by", void 0);
class LeadResponseDto {
}
exports.LeadResponseDto = LeadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lead ID' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of lead' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "lead_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status of the lead' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "lead_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temperature of the lead' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "lead_temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Origin of the lead' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "lead_origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the lead' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "lead_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notes about the lead' }),
    __metadata("design:type", Array)
], LeadResponseDto.prototype, "lead_notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who first contacted this lead' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "first_contacted_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Person ID' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "person_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of the person' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary document type' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "document_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary document number' }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "document_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional addresses', type: [AddressResponseDto] }),
    __metadata("design:type", Array)
], LeadResponseDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional contacts', type: [ContactResponseDto] }),
    __metadata("design:type", Array)
], LeadResponseDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional documents', type: [DocumentResponseDto] }),
    __metadata("design:type", Array)
], LeadResponseDto.prototype, "other_documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], LeadResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created this record', required: false }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], LeadResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who last updated this record', required: false }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deletion timestamp (soft delete)', required: false }),
    __metadata("design:type", Date)
], LeadResponseDto.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who deleted this record', required: false }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "deleted_by", void 0);
//# sourceMappingURL=lead-response.dto.js.map