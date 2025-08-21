"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PersonValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonValidator = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let PersonValidator = PersonValidator_1 = class PersonValidator {
    constructor() {
        this.logger = new common_1.Logger(PersonValidator_1.name);
        this.expectedDocumentTypes = [
            'cpf',
            'cnpj',
            'rg',
            'passport',
            'driver_license',
            'voter_id',
            'work_card',
            'other'
        ];
    }
    async validateCreate(data) {
        this.logger.log('Validating person creation data');
        if (!data.full_name || typeof data.full_name !== 'string') {
            throw new common_1.BadRequestException('Full name is required and must be a string');
        }
        if (data.full_name.length < 2) {
            throw new common_1.BadRequestException('Full name must be at least 2 characters long');
        }
        if (data.full_name.length > 100) {
            throw new common_1.BadRequestException('Full name must not exceed 100 characters');
        }
        if (!data.document_type || typeof data.document_type !== 'string') {
            throw new common_1.BadRequestException('Document type is required and must be a string');
        }
        if (!this.expectedDocumentTypes.includes(data.document_type.toLowerCase())) {
            throw new common_1.BadRequestException(`Document type must be one of: ${this.expectedDocumentTypes.join(', ')}`);
        }
        if (!data.document_number || typeof data.document_number !== 'string') {
            throw new common_1.BadRequestException('Document number is required and must be a string');
        }
        if (data.document_number.length < 3) {
            throw new common_1.BadRequestException('Document number must be at least 3 characters long');
        }
        if (data.document_number.length > 20) {
            throw new common_1.BadRequestException('Document number must not exceed 20 characters');
        }
        await this.validateDocumentNumberFormat(data.document_type, data.document_number);
        if (!data.tenant_id || typeof data.tenant_id !== 'string') {
            throw new common_1.BadRequestException('Tenant ID is required and must be a string');
        }
        if (!(0, class_validator_1.IsUUID)(data.tenant_id)) {
            throw new common_1.BadRequestException('Tenant ID must be a valid UUID');
        }
        this.logger.log('Person creation data validation passed');
    }
    async validateUpdate(data) {
        this.logger.log('Validating person update data');
        if (data.full_name !== undefined) {
            if (typeof data.full_name !== 'string') {
                throw new common_1.BadRequestException('Full name must be a string');
            }
            if (data.full_name.length < 2) {
                throw new common_1.BadRequestException('Full name must be at least 2 characters long');
            }
            if (data.full_name.length > 100) {
                throw new common_1.BadRequestException('Full name must not exceed 100 characters');
            }
        }
        if (data.document_type !== undefined) {
            if (typeof data.document_type !== 'string') {
                throw new common_1.BadRequestException('Document type must be a string');
            }
            if (!this.expectedDocumentTypes.includes(data.document_type.toLowerCase())) {
                throw new common_1.BadRequestException(`Document type must be one of: ${this.expectedDocumentTypes.join(', ')}`);
            }
        }
        if (data.document_number !== undefined) {
            if (typeof data.document_number !== 'string') {
                throw new common_1.BadRequestException('Document number must be a string');
            }
            if (data.document_number.length < 3) {
                throw new common_1.BadRequestException('Document number must be at least 3 characters long');
            }
            if (data.document_number.length > 20) {
                throw new common_1.BadRequestException('Document number must not exceed 20 characters');
            }
            if (data.document_type) {
                await this.validateDocumentNumberFormat(data.document_type, data.document_number);
            }
        }
        this.logger.log('Person update data validation passed');
    }
    async validateDocumentNumberFormat(documentType, documentNumber) {
        const type = documentType.toLowerCase();
        switch (type) {
            case 'cpf':
                if (!this.isValidCPF(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid CPF format');
                }
                break;
            case 'cnpj':
                if (!this.isValidCNPJ(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid CNPJ format');
                }
                break;
            case 'rg':
                if (!this.isValidRG(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid RG format');
                }
                break;
            case 'passport':
                if (!this.isValidPassport(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid passport format');
                }
                break;
            case 'driver_license':
                if (!this.isValidDriverLicense(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid driver license format');
                }
                break;
            case 'voter_id':
                if (!this.isValidVoterId(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid voter ID format');
                }
                break;
            case 'work_card':
                if (!this.isValidWorkCard(documentNumber)) {
                    throw new common_1.BadRequestException('Invalid work card format');
                }
                break;
            case 'other':
                if (!documentNumber.trim()) {
                    throw new common_1.BadRequestException('Document number cannot be empty');
                }
                break;
            default:
                throw new common_1.BadRequestException(`Unknown document type: ${documentType}`);
        }
    }
    isValidCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        if (cleanCPF.length !== 11)
            return false;
        if (/^(\d)\1{10}$/.test(cleanCPF))
            return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11)
            remainder = 0;
        if (remainder !== parseInt(cleanCPF.charAt(9)))
            return false;
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11)
            remainder = 0;
        if (remainder !== parseInt(cleanCPF.charAt(10)))
            return false;
        return true;
    }
    isValidCNPJ(cnpj) {
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        if (cleanCNPJ.length !== 14)
            return false;
        if (/^(\d)\1{13}$/.test(cleanCNPJ))
            return false;
        let sum = 0;
        let weight = 2;
        for (let i = 11; i >= 0; i--) {
            sum += parseInt(cleanCNPJ.charAt(i)) * weight;
            weight = weight === 9 ? 2 : weight + 1;
        }
        let remainder = sum % 11;
        let digit1 = remainder < 2 ? 0 : 11 - remainder;
        if (parseInt(cleanCNPJ.charAt(12)) !== digit1)
            return false;
        sum = 0;
        weight = 2;
        for (let i = 12; i >= 0; i--) {
            sum += parseInt(cleanCNPJ.charAt(i)) * weight;
            weight = weight === 9 ? 2 : weight + 1;
        }
        remainder = sum % 11;
        let digit2 = remainder < 2 ? 0 : 11 - remainder;
        return parseInt(cleanCNPJ.charAt(13)) === digit2;
    }
    isValidRG(rg) {
        const cleanRG = rg.replace(/[^a-zA-Z0-9]/g, '');
        return cleanRG.length >= 8 && cleanRG.length <= 12;
    }
    isValidPassport(passport) {
        const cleanPassport = passport.replace(/\s/g, '');
        return cleanPassport.length >= 6 && cleanPassport.length <= 12 && /^[a-zA-Z0-9]+$/.test(cleanPassport);
    }
    isValidDriverLicense(driverLicense) {
        const cleanLicense = driverLicense.replace(/\D/g, '');
        return cleanLicense.length === 11;
    }
    isValidVoterId(voterId) {
        const cleanVoterId = voterId.replace(/\D/g, '');
        return cleanVoterId.length === 12;
    }
    isValidWorkCard(workCard) {
        const cleanWorkCard = workCard.replace(/\D/g, '');
        return cleanWorkCard.length === 11;
    }
};
exports.PersonValidator = PersonValidator;
exports.PersonValidator = PersonValidator = PersonValidator_1 = __decorate([
    (0, common_1.Injectable)()
], PersonValidator);
//# sourceMappingURL=person.validator.js.map