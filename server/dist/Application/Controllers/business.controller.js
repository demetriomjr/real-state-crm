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
var BusinessController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const business_service_1 = require("../Services/business.service");
const DTOs_1 = require("../DTOs");
const authorization_response_dto_1 = require("../DTOs/Authorization/authorization-response.dto");
const auth_guard_1 = require("../Features/auth.guard");
const test_auth_guard_1 = require("../Features/test-auth.guard");
const authorization_service_1 = require("../Services/authorization.service");
let BusinessController = BusinessController_1 = class BusinessController {
    constructor(businessService, authorizationService) {
        this.businessService = businessService;
        this.authorizationService = authorizationService;
        this.logger = new common_1.Logger(BusinessController_1.name);
    }
    async findAll(page = 1, limit = 10, req) {
        const userLevel = req.userLevel;
        if (userLevel < 10) {
            this.logger.warn(`User with level ${userLevel} attempted to access findAll - access denied`);
            throw new common_1.BadRequestException("Access denied. Developer level (10) required to view all businesses.");
        }
        return this.businessService.findAll(page, limit, userLevel);
    }
    async findOne(id, req) {
        const userLevel = req.userLevel;
        const userTenantId = req.tenantId;
        if (userLevel < 8) {
            throw new common_1.BadRequestException("Access denied. Admin level (8+) required to view business details.");
        }
        if (userTenantId && userTenantId !== id) {
            throw new common_1.BadRequestException("Access denied. You can only access your own business.");
        }
        return this.businessService.findOne(id);
    }
    async create(createBusinessDto) {
        return this.businessService.create(createBusinessDto);
    }
    async update(id, updateBusinessDto, req) {
        const userLevel = req.userLevel;
        const userTenantId = req.tenantId;
        if (userLevel < 8) {
            throw new common_1.BadRequestException("Access denied. Admin level (8+) required to update business.");
        }
        if (userTenantId && userTenantId !== id) {
            throw new common_1.BadRequestException("Access denied. You can only update your own business.");
        }
        return this.businessService.update(id, updateBusinessDto);
    }
    async remove(id, req) {
        const userLevel = req.userLevel;
        const userTenantId = req.tenantId;
        if (userLevel < 10) {
            throw new common_1.BadRequestException("Access denied. Developer level (10) required to delete business.");
        }
        if (userTenantId && userTenantId !== id) {
            throw new common_1.BadRequestException("Access denied. The business ID must match your tenant ID.");
        }
        return this.businessService.remove(id);
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(process.env.NODE_ENV === "test" ? test_auth_guard_1.TestAuthGuard : auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get all businesses with pagination (Developer Only)",
        description: "Retrieves a paginated list of all businesses. This endpoint requires developer level (10) access. In production, this endpoint is restricted to developers only.",
    }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        required: false,
        description: "Page number (default: 1)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        required: false,
        description: "Items per page (default: 10)",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns paginated list of businesses",
        type: [DTOs_1.BusinessResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Access denied - Developer level required",
    }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(process.env.NODE_ENV === "test" ? test_auth_guard_1.TestAuthGuard : auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get business by ID (Admin Only)",
        description: "Retrieves business details by ID. This endpoint requires admin level (8+) access.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Business ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns business details",
        type: DTOs_1.BusinessResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Access denied - Admin level required",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Business not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: "Create a new business with master user",
        description: "Creates a new business and automatically creates a master user (owner) with user_level 9. The master user cannot be deleted and has full administrative privileges. Returns an authentication token for the master user.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Business and master user created successfully",
        type: authorization_response_dto_1.AuthorizationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Validation error or master user username already exists",
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Master user username already exists",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTOs_1.BusinessCreateDto]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(process.env.NODE_ENV === "test" ? test_auth_guard_1.TestAuthGuard : auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Update business by ID (Admin Only)",
        description: "Updates business information. This endpoint requires admin level (8+) access and tenant isolation.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Business ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Business updated successfully",
        type: DTOs_1.BusinessResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Access denied - Admin level required",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Business not found" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DTOs_1.BusinessUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(process.env.NODE_ENV === "test" ? test_auth_guard_1.TestAuthGuard : auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: "Soft delete business by ID (Developer Only)",
        description: 'Performs a soft delete of the business. This endpoint requires developer level (10) access. The "id" parameter is the tenant_id from the request.',
    }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "Business ID (UUID) - must match tenant_id from request",
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Business deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Access denied - Developer level required",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Business not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "remove", null);
exports.BusinessController = BusinessController = BusinessController_1 = __decorate([
    (0, swagger_1.ApiTags)("businesses"),
    (0, common_1.Controller)("businesses"),
    __metadata("design:paramtypes", [business_service_1.BusinessService,
        authorization_service_1.AuthorizationService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map