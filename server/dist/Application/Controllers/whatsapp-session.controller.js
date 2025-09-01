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
var WhatsappSessionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappSessionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const whatsapp_session_service_1 = require("../Services/whatsapp-session.service");
const WhatsappSession_1 = require("../DTOs/WhatsappSession");
const auth_guard_1 = require("../Features/auth.guard");
const auth_guard_2 = require("../Features/auth.guard");
let WhatsappSessionController = WhatsappSessionController_1 = class WhatsappSessionController {
    constructor(whatsappSessionService) {
        this.whatsappSessionService = whatsappSessionService;
        this.logger = new common_1.Logger(WhatsappSessionController_1.name);
    }
    async findAll(tenantId) {
        this.logger.log(`Getting all WhatsApp sessions for tenant: ${tenantId}`);
        return this.whatsappSessionService.findAll(tenantId);
    }
    async findOne(id, tenantId) {
        this.logger.log(`Getting WhatsApp session: ${id} for tenant: ${tenantId}`);
        return this.whatsappSessionService.findOne(id, tenantId);
    }
    async create(createSessionDto, tenantId) {
        this.logger.log(`Creating WhatsApp session: ${createSessionDto.session_name} for tenant: ${tenantId}`);
        createSessionDto.tenant_id = tenantId;
        return this.whatsappSessionService.create(createSessionDto);
    }
    async update(id, updateSessionDto, tenantId) {
        this.logger.log(`Updating WhatsApp session: ${id} for tenant: ${tenantId}`);
        return this.whatsappSessionService.update(id, updateSessionDto, tenantId);
    }
    async delete(id, tenantId) {
        this.logger.log(`Deleting WhatsApp session: ${id} for tenant: ${tenantId}`);
        await this.whatsappSessionService.delete(id, tenantId);
    }
    async refreshQRCode(id, tenantId) {
        this.logger.log(`Refreshing QR code for WhatsApp session: ${id} for tenant: ${tenantId}`);
        return this.whatsappSessionService.refreshQRCode(id, tenantId);
    }
    async getSessionState(id, tenantId) {
        this.logger.log(`Getting state for WhatsApp session: ${id} for tenant: ${tenantId}`);
        return this.whatsappSessionService.getSessionState(id, tenantId);
    }
};
exports.WhatsappSessionController = WhatsappSessionController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get all WhatsApp sessions",
        description: "Retrieve all WhatsApp sessions for the current tenant.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sessions retrieved successfully.", type: [WhatsappSession_1.WhatsappSessionResponseDto] }),
    __param(0, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "Get WhatsApp session by ID",
        description: "Retrieve a specific WhatsApp session by its ID.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Session retrieved successfully.", type: WhatsappSession_1.WhatsappSessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Session not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: "Create WhatsApp session",
        description: "Create a new WhatsApp session and generate QR code for authentication.",
    }),
    (0, swagger_1.ApiBody)({ type: WhatsappSession_1.WhatsappSessionCreateDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Session created successfully.", type: WhatsappSession_1.WhatsappSessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid session data." }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WhatsappSession_1.WhatsappSessionCreateDto, String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update WhatsApp session",
        description: "Update an existing WhatsApp session.",
    }),
    (0, swagger_1.ApiBody)({ type: WhatsappSession_1.WhatsappSessionUpdateDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Session updated successfully.", type: WhatsappSession_1.WhatsappSessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Session not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, WhatsappSession_1.WhatsappSessionUpdateDto, String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: "Delete WhatsApp session",
        description: "Delete a WhatsApp session and remove it from WAHA.",
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Session deleted successfully." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Session not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(":id/refresh-qr"),
    (0, swagger_1.ApiOperation)({
        summary: "Refresh QR code",
        description: "Generate a new QR code for a pending WhatsApp session.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "QR code refreshed successfully.", type: WhatsappSession_1.WhatsappSessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Cannot refresh QR code for connected session." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Session not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "refreshQRCode", null);
__decorate([
    (0, common_1.Get)(":id/state"),
    (0, swagger_1.ApiOperation)({
        summary: "Get session state",
        description: "Get the current state of a WhatsApp session from WAHA.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Session state retrieved successfully." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Session not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, auth_guard_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WhatsappSessionController.prototype, "getSessionState", null);
exports.WhatsappSessionController = WhatsappSessionController = WhatsappSessionController_1 = __decorate([
    (0, swagger_1.ApiTags)("WhatsApp Sessions"),
    (0, common_1.Controller)("whatsapp-sessions"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [whatsapp_session_service_1.WhatsappSessionService])
], WhatsappSessionController);
//# sourceMappingURL=whatsapp-session.controller.js.map