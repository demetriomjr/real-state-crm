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
exports.LeadController = void 0;
const common_1 = require("@nestjs/common");
const lead_service_1 = require("../Services/lead.service");
const lead_create_dto_1 = require("../DTOs/Leads/lead-create.dto");
const lead_update_dto_1 = require("../DTOs/Leads/lead-update.dto");
const auth_guard_1 = require("../Features/auth.guard");
let LeadController = class LeadController {
    constructor(leadService) {
        this.leadService = leadService;
    }
    async createLead(createLeadDto, req) {
        const userId = req.user?.id;
        const { lead_type, lead_status, lead_temperature, lead_origin, lead_description, lead_notes, first_contacted_by, full_name, document_type, document_number, addresses, contacts, other_documents, } = createLeadDto;
        const leadData = {
            lead_type,
            lead_status,
            lead_temperature,
            lead_origin,
            lead_description,
            lead_notes,
            first_contacted_by,
        };
        const personData = {
            full_name,
            document_type,
            document_number,
            addresses,
            contacts,
            documents: other_documents,
        };
        const createdLead = await this.leadService.createLead(leadData, personData, userId);
        return createdLead;
    }
    async getAllLeads(page = "1", limit = "10") {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const result = await this.leadService.getAllLeads(pageNum, limitNum);
        return {
            ...result,
            leads: result.leads,
        };
    }
    async getLeadById(id) {
        const lead = await this.leadService.getLeadById(id);
        return lead;
    }
    async updateLead(id, updateLeadDto, req) {
        const userId = req.user?.id;
        const { lead_type, lead_status, lead_temperature, lead_origin, lead_description, lead_notes, first_contacted_by, full_name, document_type, document_number, addresses, contacts, other_documents, } = updateLeadDto;
        const leadData = {
            lead_type,
            lead_status,
            lead_temperature,
            lead_origin,
            lead_description,
            lead_notes,
            first_contacted_by,
        };
        const personData = {
            full_name,
            document_type,
            document_number,
            addresses,
            contacts,
            documents: other_documents,
        };
        const updatedLead = await this.leadService.updateLead(id, leadData, personData, userId);
        return updatedLead;
    }
    async deleteLead(id, req) {
        const userId = req.user?.id;
        await this.leadService.deleteLead(id, userId);
        return { message: "Lead deleted successfully" };
    }
};
exports.LeadController = LeadController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lead_create_dto_1.LeadCreateDto, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "createLead", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getAllLeads", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getLeadById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lead_update_dto_1.LeadUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "updateLead", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "deleteLead", null);
exports.LeadController = LeadController = __decorate([
    (0, common_1.Controller)("leads"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [lead_service_1.LeadService])
], LeadController);
//# sourceMappingURL=lead.controller.js.map