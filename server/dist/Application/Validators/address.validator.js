"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AddressValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressValidator = void 0;
const common_1 = require("@nestjs/common");
let AddressValidator = AddressValidator_1 = class AddressValidator {
    constructor() {
        this.logger = new common_1.Logger(AddressValidator_1.name);
    }
    async validateCreate(data) {
        this.logger.log("Validating address creation data");
        if (!data.address_line_1 || typeof data.address_line_1 !== "string") {
            throw new common_1.BadRequestException("Address line 1 is required and must be a string");
        }
        if (!data.address_line_1.trim()) {
            throw new common_1.BadRequestException("Address line 1 cannot be empty");
        }
        if (data.address_line_1.length > 200) {
            throw new common_1.BadRequestException("Address line 1 must not exceed 200 characters");
        }
        if (!data.city || typeof data.city !== "string") {
            throw new common_1.BadRequestException("City is required and must be a string");
        }
        if (!data.city.trim()) {
            throw new common_1.BadRequestException("City cannot be empty");
        }
        if (data.city.length > 100) {
            throw new common_1.BadRequestException("City must not exceed 100 characters");
        }
        if (!data.state || typeof data.state !== "string") {
            throw new common_1.BadRequestException("State is required and must be a string");
        }
        if (!data.state.trim()) {
            throw new common_1.BadRequestException("State cannot be empty");
        }
        if (data.state.length > 50) {
            throw new common_1.BadRequestException("State must not exceed 50 characters");
        }
        if (!data.country || typeof data.country !== "string") {
            throw new common_1.BadRequestException("Country is required and must be a string");
        }
        if (!data.country.trim()) {
            throw new common_1.BadRequestException("Country cannot be empty");
        }
        if (data.country.length > 100) {
            throw new common_1.BadRequestException("Country must not exceed 100 characters");
        }
        if (!data.zip_code || typeof data.zip_code !== "string") {
            throw new common_1.BadRequestException("ZIP code is required and must be a string");
        }
        if (!data.zip_code.trim()) {
            throw new common_1.BadRequestException("ZIP code cannot be empty");
        }
        if (data.zip_code.length > 20) {
            throw new common_1.BadRequestException("ZIP code must not exceed 20 characters");
        }
        if (data.district !== undefined && data.district !== null) {
            if (typeof data.district !== "string") {
                throw new common_1.BadRequestException("District must be a string");
            }
            if (data.district.trim() === "") {
                throw new common_1.BadRequestException("District cannot be empty if provided");
            }
            if (data.district.length > 100) {
                throw new common_1.BadRequestException("District must not exceed 100 characters");
            }
        }
        if (data.address_line_2 !== undefined && data.address_line_2 !== null) {
            if (typeof data.address_line_2 !== "string") {
                throw new common_1.BadRequestException("Address line 2 must be a string");
            }
            if (data.address_line_2.trim() === "") {
                throw new common_1.BadRequestException("Address line 2 cannot be empty if provided");
            }
            if (data.address_line_2.length > 200) {
                throw new common_1.BadRequestException("Address line 2 must not exceed 200 characters");
            }
        }
        if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
            throw new common_1.BadRequestException("is_primary must be a boolean");
        }
        this.logger.log("Address creation data validation passed");
    }
    async validateUpdate(data) {
        this.logger.log("Validating address update data");
        if (data.address_line_1 !== undefined) {
            if (typeof data.address_line_1 !== "string") {
                throw new common_1.BadRequestException("Address line 1 must be a string");
            }
            if (!data.address_line_1.trim()) {
                throw new common_1.BadRequestException("Address line 1 cannot be empty");
            }
            if (data.address_line_1.length > 200) {
                throw new common_1.BadRequestException("Address line 1 must not exceed 200 characters");
            }
        }
        if (data.city !== undefined) {
            if (typeof data.city !== "string") {
                throw new common_1.BadRequestException("City must be a string");
            }
            if (!data.city.trim()) {
                throw new common_1.BadRequestException("City cannot be empty");
            }
            if (data.city.length > 100) {
                throw new common_1.BadRequestException("City must not exceed 100 characters");
            }
        }
        if (data.state !== undefined) {
            if (typeof data.state !== "string") {
                throw new common_1.BadRequestException("State must be a string");
            }
            if (!data.state.trim()) {
                throw new common_1.BadRequestException("State cannot be empty");
            }
            if (data.state.length > 50) {
                throw new common_1.BadRequestException("State must not exceed 50 characters");
            }
        }
        if (data.country !== undefined) {
            if (typeof data.country !== "string") {
                throw new common_1.BadRequestException("Country must be a string");
            }
            if (!data.country.trim()) {
                throw new common_1.BadRequestException("Country cannot be empty");
            }
            if (data.country.length > 100) {
                throw new common_1.BadRequestException("Country must not exceed 100 characters");
            }
        }
        if (data.zip_code !== undefined) {
            if (typeof data.zip_code !== "string") {
                throw new common_1.BadRequestException("ZIP code must be a string");
            }
            if (!data.zip_code.trim()) {
                throw new common_1.BadRequestException("ZIP code cannot be empty");
            }
            if (data.zip_code.length > 20) {
                throw new common_1.BadRequestException("ZIP code must not exceed 20 characters");
            }
        }
        if (data.district !== undefined && data.district !== null) {
            if (typeof data.district !== "string") {
                throw new common_1.BadRequestException("District must be a string");
            }
            if (data.district.trim() === "") {
                throw new common_1.BadRequestException("District cannot be empty if provided");
            }
            if (data.district.length > 100) {
                throw new common_1.BadRequestException("District must not exceed 100 characters");
            }
        }
        if (data.address_line_2 !== undefined && data.address_line_2 !== null) {
            if (typeof data.address_line_2 !== "string") {
                throw new common_1.BadRequestException("Address line 2 must be a string");
            }
            if (data.address_line_2.trim() === "") {
                throw new common_1.BadRequestException("Address line 2 cannot be empty if provided");
            }
            if (data.address_line_2.length > 200) {
                throw new common_1.BadRequestException("Address line 2 must not exceed 200 characters");
            }
        }
        if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
            throw new common_1.BadRequestException("is_primary must be a boolean");
        }
        this.logger.log("Address update data validation passed");
    }
};
exports.AddressValidator = AddressValidator;
exports.AddressValidator = AddressValidator = AddressValidator_1 = __decorate([
    (0, common_1.Injectable)()
], AddressValidator);
//# sourceMappingURL=address.validator.js.map