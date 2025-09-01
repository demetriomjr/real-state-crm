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
var TenantValidationMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantValidationMiddleware = void 0;
const common_1 = require("@nestjs/common");
const business_service_1 = require("../Services/business.service");
const config_1 = require("@nestjs/config");
let TenantValidationMiddleware = TenantValidationMiddleware_1 = class TenantValidationMiddleware {
    constructor(businessService, configService) {
        this.businessService = businessService;
        this.configService = configService;
        this.logger = new common_1.Logger(TenantValidationMiddleware_1.name);
    }
    async use(req, res, next) {
        const tenantId = req["tenantId"];
        const userLevel = req["userLevel"];
        const isDevelopment = this.configService.get("NODE_ENV") === "development";
        const isTest = this.configService.get("NODE_ENV") === "test";
        if (isTest) {
            this.logger.log("Test environment: Skipping tenant validation");
            return next();
        }
        const path = req.path;
        const method = req.method;
        if (method === "POST" && path === "/api/businesses") {
            this.logger.log("Skipping tenant validation for business creation endpoint");
            return next();
        }
        if (method === "POST" &&
            path === "/integrated-services/whatsapp/webhook") {
            this.logger.log("Skipping tenant validation for WhatsApp inbound webhook");
            return next();
        }
        if (!tenantId || userLevel === undefined) {
            this.logger.warn("Missing tenant_id or user_level in request");
            throw new common_1.UnauthorizedException("Missing tenant_id or user_level");
        }
        if (isDevelopment &&
            (!tenantId || tenantId === "00000000-0000-0000-0000-000000000000") &&
            userLevel >= 10) {
            this.logger.log("Development mode: Skipping tenant validation for admin user");
            return next();
        }
        const isValidTenant = await this.businessService.validateTenantId(tenantId);
        if (!isValidTenant) {
            this.logger.warn(`Invalid tenant_id: ${tenantId}`);
            throw new common_1.UnauthorizedException("Invalid tenant_id");
        }
        this.logger.log(`Tenant validation passed for tenant_id: ${tenantId}`);
        next();
    }
};
exports.TenantValidationMiddleware = TenantValidationMiddleware;
exports.TenantValidationMiddleware = TenantValidationMiddleware = TenantValidationMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [business_service_1.BusinessService,
        config_1.ConfigService])
], TenantValidationMiddleware);
//# sourceMappingURL=tenant-validation.middleware.js.map