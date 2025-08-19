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
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const business_service_1 = require("../Services/business.service");
const DTOs_1 = require("../DTOs");
let BusinessController = class BusinessController {
    constructor(businessService) {
        this.businessService = businessService;
    }
    async findAll(page = 1, limit = 10) {
        return this.businessService.findAll(page, limit);
    }
    async findOne(id) {
        return this.businessService.findOne(id);
    }
    async create(createBusinessDto) {
        return this.businessService.create(createBusinessDto);
    }
    async update(id, updateBusinessDto) {
        return this.businessService.update(id, updateBusinessDto);
    }
    async remove(id) {
        return this.businessService.remove(id);
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all businesses with pagination',
        description: 'Retrieves a paginated list of all businesses. Note: This endpoint is not protected by authentication for business discovery purposes.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated list of businesses', type: [DTOs_1.BusinessResponseDto] }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get business by ID',
        description: 'Retrieves business details by ID. Note: This endpoint is not protected by authentication for business discovery purposes.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Business ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns business details', type: DTOs_1.BusinessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new business with master user',
        description: 'Creates a new business and automatically creates a master user (owner) with user_level 9. The master user cannot be deleted and has full administrative privileges. Returns an authentication token for the master user.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Business and master user created successfully',
        type: DTOs_1.BusinessCreateResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or master user username already exists' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Master user username already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTOs_1.BusinessCreateDto]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update business by ID',
        description: 'Updates business information. Note: This endpoint requires authentication and proper authorization.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Business ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business updated successfully', type: DTOs_1.BusinessResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DTOs_1.BusinessUpdateDto]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Soft delete business by ID',
        description: 'Performs a soft delete of the business. Note: This endpoint requires authentication and proper authorization.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Business ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Business deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "remove", null);
exports.BusinessController = BusinessController = __decorate([
    (0, swagger_1.ApiTags)('businesses'),
    (0, common_1.Controller)('businesses'),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map