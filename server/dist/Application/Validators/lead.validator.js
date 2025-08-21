"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LeadValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadValidator = void 0;
const common_1 = require("@nestjs/common");
let LeadValidator = LeadValidator_1 = class LeadValidator {
    constructor() {
        this.logger = new common_1.Logger(LeadValidator_1.name);
        this.expectedLeadTypes = ['customer', 'prospect'];
        this.expectedLeadStatuses = ['new', 'contacted', 'qualified', 'won', 'lost'];
        this.expectedLeadTemperatures = ['hot', 'warm', 'cold'];
        this.expectedLeadOrigins = ['website', 'email', 'phone', 'whatsapp', 'cellphone', 'other'];
    }
    async validateCreate(data) {
        this.logger.log('Validating lead creation data');
        if (!data.lead_type || typeof data.lead_type !== 'string') {
            throw new common_1.BadRequestException('Lead type is required and must be a string');
        }
        if (!this.expectedLeadTypes.includes(data.lead_type.toLowerCase())) {
            throw new common_1.BadRequestException(`Lead type must be one of: ${this.expectedLeadTypes.join(', ')}`);
        }
        if (!data.lead_status || typeof data.lead_status !== 'string') {
            throw new common_1.BadRequestException('Lead status is required and must be a string');
        }
        if (!this.expectedLeadStatuses.includes(data.lead_status.toLowerCase())) {
            throw new common_1.BadRequestException(`Lead status must be one of: ${this.expectedLeadStatuses.join(', ')}`);
        }
        if (!data.lead_temperature || typeof data.lead_temperature !== 'string') {
            throw new common_1.BadRequestException('Lead temperature is required and must be a string');
        }
        if (!this.expectedLeadTemperatures.includes(data.lead_temperature.toLowerCase())) {
            throw new common_1.BadRequestException(`Lead temperature must be one of: ${this.expectedLeadTemperatures.join(', ')}`);
        }
        if (!data.lead_origin || typeof data.lead_origin !== 'string') {
            throw new common_1.BadRequestException('Lead origin is required and must be a string');
        }
        if (!this.expectedLeadOrigins.includes(data.lead_origin.toLowerCase())) {
            throw new common_1.BadRequestException(`Lead origin must be one of: ${this.expectedLeadOrigins.join(', ')}`);
        }
        if (!data.lead_description || typeof data.lead_description !== 'string') {
            throw new common_1.BadRequestException('Lead description is required and must be a string');
        }
        if (!data.lead_description.trim()) {
            throw new common_1.BadRequestException('Lead description cannot be empty');
        }
        if (data.lead_description.length > 1000) {
            throw new common_1.BadRequestException('Lead description must not exceed 1000 characters');
        }
        if (data.lead_notes !== undefined) {
            if (!Array.isArray(data.lead_notes)) {
                throw new common_1.BadRequestException('Lead notes must be an array');
            }
            for (let i = 0; i < data.lead_notes.length; i++) {
                const note = data.lead_notes[i];
                if (typeof note !== 'string') {
                    throw new common_1.BadRequestException(`Lead note at index ${i} must be a string`);
                }
                if (!note.trim()) {
                    throw new common_1.BadRequestException(`Lead note at index ${i} cannot be empty`);
                }
                if (note.length > 500) {
                    throw new common_1.BadRequestException(`Lead note at index ${i} must not exceed 500 characters`);
                }
            }
        }
        if (!data.first_contacted_by || typeof data.first_contacted_by !== 'string') {
            throw new common_1.BadRequestException('First contacted by is required and must be a string');
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(data.first_contacted_by)) {
            throw new common_1.BadRequestException('First contacted by must be a valid UUID');
        }
        this.logger.log('Lead creation data validation passed');
    }
    async validateUpdate(data) {
        this.logger.log('Validating lead update data');
        if (data.lead_type !== undefined) {
            if (typeof data.lead_type !== 'string') {
                throw new common_1.BadRequestException('Lead type must be a string');
            }
            if (!this.expectedLeadTypes.includes(data.lead_type.toLowerCase())) {
                throw new common_1.BadRequestException(`Lead type must be one of: ${this.expectedLeadTypes.join(', ')}`);
            }
        }
        if (data.lead_status !== undefined) {
            if (typeof data.lead_status !== 'string') {
                throw new common_1.BadRequestException('Lead status must be a string');
            }
            if (!this.expectedLeadStatuses.includes(data.lead_status.toLowerCase())) {
                throw new common_1.BadRequestException(`Lead status must be one of: ${this.expectedLeadStatuses.join(', ')}`);
            }
        }
        if (data.lead_temperature !== undefined) {
            if (typeof data.lead_temperature !== 'string') {
                throw new common_1.BadRequestException('Lead temperature must be a string');
            }
            if (!this.expectedLeadTemperatures.includes(data.lead_temperature.toLowerCase())) {
                throw new common_1.BadRequestException(`Lead temperature must be one of: ${this.expectedLeadTemperatures.join(', ')}`);
            }
        }
        if (data.lead_origin !== undefined) {
            if (typeof data.lead_origin !== 'string') {
                throw new common_1.BadRequestException('Lead origin must be a string');
            }
            if (!this.expectedLeadOrigins.includes(data.lead_origin.toLowerCase())) {
                throw new common_1.BadRequestException(`Lead origin must be one of: ${this.expectedLeadOrigins.join(', ')}`);
            }
        }
        if (data.lead_description !== undefined) {
            if (typeof data.lead_description !== 'string') {
                throw new common_1.BadRequestException('Lead description must be a string');
            }
            if (!data.lead_description.trim()) {
                throw new common_1.BadRequestException('Lead description cannot be empty');
            }
            if (data.lead_description.length > 1000) {
                throw new common_1.BadRequestException('Lead description must not exceed 1000 characters');
            }
        }
        if (data.lead_notes !== undefined) {
            if (!Array.isArray(data.lead_notes)) {
                throw new common_1.BadRequestException('Lead notes must be an array');
            }
            for (let i = 0; i < data.lead_notes.length; i++) {
                const note = data.lead_notes[i];
                if (typeof note !== 'string') {
                    throw new common_1.BadRequestException(`Lead note at index ${i} must be a string`);
                }
                if (!note.trim()) {
                    throw new common_1.BadRequestException(`Lead note at index ${i} cannot be empty`);
                }
                if (note.length > 500) {
                    throw new common_1.BadRequestException(`Lead note at index ${i} must not exceed 500 characters`);
                }
            }
        }
        if (data.first_contacted_by !== undefined) {
            if (typeof data.first_contacted_by !== 'string') {
                throw new common_1.BadRequestException('First contacted by must be a string');
            }
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(data.first_contacted_by)) {
                throw new common_1.BadRequestException('First contacted by must be a valid UUID');
            }
        }
        this.logger.log('Lead update data validation passed');
    }
};
exports.LeadValidator = LeadValidator;
exports.LeadValidator = LeadValidator = LeadValidator_1 = __decorate([
    (0, common_1.Injectable)()
], LeadValidator);
//# sourceMappingURL=lead.validator.js.map