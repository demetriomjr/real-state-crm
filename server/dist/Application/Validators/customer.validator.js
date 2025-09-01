"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CustomerValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerValidator = void 0;
const common_1 = require("@nestjs/common");
let CustomerValidator = CustomerValidator_1 = class CustomerValidator {
    constructor() {
        this.logger = new common_1.Logger(CustomerValidator_1.name);
        this.expectedCustomerTypes = ["individual", "company"];
        this.expectedCustomerStatuses = ["active", "inactive"];
    }
    async validateCreate(data) {
        this.logger.log("Validating customer creation data");
        if (!data.customer_type || typeof data.customer_type !== "string") {
            throw new common_1.BadRequestException("Customer type is required and must be a string");
        }
        if (!this.expectedCustomerTypes.includes(data.customer_type.toLowerCase())) {
            throw new common_1.BadRequestException(`Customer type must be one of: ${this.expectedCustomerTypes.join(", ")}`);
        }
        if (!data.customer_status || typeof data.customer_status !== "string") {
            throw new common_1.BadRequestException("Customer status is required and must be a string");
        }
        if (!this.expectedCustomerStatuses.includes(data.customer_status.toLowerCase())) {
            throw new common_1.BadRequestException(`Customer status must be one of: ${this.expectedCustomerStatuses.join(", ")}`);
        }
        if (data.fidelized_by !== undefined && data.fidelized_by !== null) {
            if (typeof data.fidelized_by !== "string") {
                throw new common_1.BadRequestException("Fidelized by must be a string");
            }
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(data.fidelized_by)) {
                throw new common_1.BadRequestException("Fidelized by must be a valid UUID");
            }
        }
        this.logger.log("Customer creation data validation passed");
    }
    async validateUpdate(data) {
        this.logger.log("Validating customer update data");
        if (data.customer_type !== undefined) {
            if (typeof data.customer_type !== "string") {
                throw new common_1.BadRequestException("Customer type must be a string");
            }
            if (!this.expectedCustomerTypes.includes(data.customer_type.toLowerCase())) {
                throw new common_1.BadRequestException(`Customer type must be one of: ${this.expectedCustomerTypes.join(", ")}`);
            }
        }
        if (data.customer_status !== undefined) {
            if (typeof data.customer_status !== "string") {
                throw new common_1.BadRequestException("Customer status must be a string");
            }
            if (!this.expectedCustomerStatuses.includes(data.customer_status.toLowerCase())) {
                throw new common_1.BadRequestException(`Customer status must be one of: ${this.expectedCustomerStatuses.join(", ")}`);
            }
        }
        if (data.fidelized_by !== undefined && data.fidelized_by !== null) {
            if (typeof data.fidelized_by !== "string") {
                throw new common_1.BadRequestException("Fidelized by must be a string");
            }
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(data.fidelized_by)) {
                throw new common_1.BadRequestException("Fidelized by must be a valid UUID");
            }
        }
        this.logger.log("Customer update data validation passed");
    }
};
exports.CustomerValidator = CustomerValidator;
exports.CustomerValidator = CustomerValidator = CustomerValidator_1 = __decorate([
    (0, common_1.Injectable)()
], CustomerValidator);
//# sourceMappingURL=customer.validator.js.map