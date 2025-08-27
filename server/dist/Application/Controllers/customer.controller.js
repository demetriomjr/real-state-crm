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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("../Services/customer.service");
const customer_create_dto_1 = require("../DTOs/Customers/customer-create.dto");
const customer_update_dto_1 = require("../DTOs/Customers/customer-update.dto");
const auth_guard_1 = require("../Features/auth.guard");
let CustomerController = class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async createCustomer(createCustomerDto, req) {
        const userId = req.user?.id;
        const { customer_type, customer_status, fidelized_by, full_name, document_type, document_number, addresses, contacts, other_documents } = createCustomerDto;
        const customerData = {
            customer_type, customer_status, fidelized_by
        };
        const personData = {
            full_name, document_type, document_number, addresses, contacts, documents: other_documents
        };
        const createdCustomer = await this.customerService.createCustomer(customerData, personData, userId);
        return createdCustomer;
    }
    async getAllCustomers(page = '1', limit = '10') {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const result = await this.customerService.getAllCustomers(pageNum, limitNum);
        return {
            ...result,
            customers: result.customers
        };
    }
    async getCustomerById(id) {
        const customer = await this.customerService.getCustomerById(id);
        return customer;
    }
    async updateCustomer(id, updateCustomerDto, req) {
        const userId = req.user?.id;
        const { customer_type, customer_status, fidelized_by, full_name, document_type, document_number, addresses, contacts, other_documents } = updateCustomerDto;
        const customerData = {
            customer_type, customer_status, fidelized_by
        };
        const personData = {
            full_name, document_type, document_number, addresses, contacts, documents: other_documents
        };
        const updatedCustomer = await this.customerService.updateCustomer(id, customerData, personData, userId);
        return updatedCustomer;
    }
    async deleteCustomer(id, req) {
        const userId = req.user?.id;
        await this.customerService.deleteCustomer(id, userId);
        return { message: 'Customer deleted successfully' };
    }
    async convertLeadToCustomer(leadId, customerData, req) {
        const userId = req.user?.id;
        const customer = await this.customerService.convertLeadToCustomer(leadId, customerData, userId);
        return customer;
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_create_dto_1.CustomerCreateDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_update_dto_1.CustomerUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteCustomer", null);
__decorate([
    (0, common_1.Post)('convert-from-lead/:leadId'),
    __param(0, (0, common_1.Param)('leadId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "convertLeadToCustomer", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('customers'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map