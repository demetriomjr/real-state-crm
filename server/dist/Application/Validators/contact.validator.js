"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ContactValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidator = void 0;
const common_1 = require("@nestjs/common");
let ContactValidator = ContactValidator_1 = class ContactValidator {
    constructor() {
        this.logger = new common_1.Logger(ContactValidator_1.name);
        this.expectedContactTypes = [
            "email",
            "phone",
            "whatsapp",
            "cellphone",
        ];
        this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.phoneRegex = /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;
        this.whatsappRegex = /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;
        this.cellphoneRegex = /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;
    }
    async validateCreate(data) {
        this.logger.log("Validating contact creation data");
        if (!data.contact_type || typeof data.contact_type !== "string") {
            throw new common_1.BadRequestException("Contact type is required and must be a string");
        }
        if (!this.expectedContactTypes.includes(data.contact_type.toLowerCase())) {
            throw new common_1.BadRequestException(`Contact type must be one of: ${this.expectedContactTypes.join(", ")}`);
        }
        if (!data.contact_value || typeof data.contact_value !== "string") {
            throw new common_1.BadRequestException("Contact value is required and must be a string");
        }
        if (!data.contact_value.trim()) {
            throw new common_1.BadRequestException("Contact value cannot be empty");
        }
        if (data.contact_value.length > 100) {
            throw new common_1.BadRequestException("Contact value must not exceed 100 characters");
        }
        await this.validateContactValueFormat(data.contact_type, data.contact_value);
        if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
            throw new common_1.BadRequestException("is_primary must be a boolean");
        }
        this.logger.log("Contact creation data validation passed");
    }
    async validateUpdate(data) {
        this.logger.log("Validating contact update data");
        if (data.contact_type !== undefined) {
            if (typeof data.contact_type !== "string") {
                throw new common_1.BadRequestException("Contact type must be a string");
            }
            if (!this.expectedContactTypes.includes(data.contact_type.toLowerCase())) {
                throw new common_1.BadRequestException(`Contact type must be one of: ${this.expectedContactTypes.join(", ")}`);
            }
        }
        if (data.contact_value !== undefined) {
            if (typeof data.contact_value !== "string") {
                throw new common_1.BadRequestException("Contact value must be a string");
            }
            if (!data.contact_value.trim()) {
                throw new common_1.BadRequestException("Contact value cannot be empty");
            }
            if (data.contact_value.length > 100) {
                throw new common_1.BadRequestException("Contact value must not exceed 100 characters");
            }
            if (data.contact_type) {
                await this.validateContactValueFormat(data.contact_type, data.contact_value);
            }
        }
        if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
            throw new common_1.BadRequestException("is_primary must be a boolean");
        }
        this.logger.log("Contact update data validation passed");
    }
    async validateContactValueFormat(contactType, contactValue) {
        const type = contactType.toLowerCase();
        const cleanValue = contactValue.trim();
        switch (type) {
            case "email":
                if (!this.emailRegex.test(cleanValue)) {
                    throw new common_1.BadRequestException("Invalid email format");
                }
                break;
            case "phone":
                if (!this.isValidPhone(cleanValue)) {
                    throw new common_1.BadRequestException("Invalid phone format");
                }
                break;
            case "whatsapp":
                if (!this.isValidWhatsApp(cleanValue)) {
                    throw new common_1.BadRequestException("Invalid WhatsApp format");
                }
                break;
            case "cellphone":
                if (!this.isValidCellphone(cleanValue)) {
                    throw new common_1.BadRequestException("Invalid cellphone format");
                }
                break;
            default:
                throw new common_1.BadRequestException(`Unknown contact type: ${contactType}`);
        }
    }
    isValidPhone(value) {
        const cleanValue = value.replace(/[\s\-\(\)\.]/g, "");
        if (!this.phoneRegex.test(cleanValue)) {
            return false;
        }
        if (cleanValue.startsWith("55")) {
            return cleanValue.length >= 13 && cleanValue.length <= 14;
        }
        return cleanValue.length >= 7 && cleanValue.length <= 15;
    }
    isValidWhatsApp(value) {
        const cleanValue = value.replace(/[\s\-\(\)\.]/g, "");
        if (!this.whatsappRegex.test(cleanValue)) {
            return false;
        }
        return this.isValidPhone(value);
    }
    isValidCellphone(value) {
        const cleanValue = value.replace(/[\s\-\(\)\.]/g, "");
        if (!this.cellphoneRegex.test(cleanValue)) {
            return false;
        }
        if (cleanValue.startsWith("55")) {
            return cleanValue.length === 13;
        }
        return cleanValue.length >= 7 && cleanValue.length <= 15;
    }
    formatPhoneNumber(value, countryCode = "BR") {
        const cleanValue = value.replace(/\D/g, "");
        if (countryCode === "BR") {
            if (cleanValue.length === 11) {
                return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 7)}-${cleanValue.substring(7)}`;
            }
            if (cleanValue.length === 13 && cleanValue.startsWith("55")) {
                return `+55 (${cleanValue.substring(2, 4)}) ${cleanValue.substring(4, 9)}-${cleanValue.substring(9)}`;
            }
        }
        return cleanValue;
    }
    isValidBrazilianPhone(value) {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length === 10 || cleanValue.length === 11) {
            return true;
        }
        if (cleanValue.length === 12 || cleanValue.length === 13) {
            return cleanValue.startsWith("55");
        }
        return false;
    }
};
exports.ContactValidator = ContactValidator;
exports.ContactValidator = ContactValidator = ContactValidator_1 = __decorate([
    (0, common_1.Injectable)()
], ContactValidator);
//# sourceMappingURL=contact.validator.js.map