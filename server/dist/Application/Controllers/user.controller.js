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
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../Services/user.service");
const DTOs_1 = require("../DTOs");
const user_validator_1 = require("../Validators/user.validator");
const auth_guard_1 = require("../Features/auth.guard");
const authorization_service_1 = require("../Services/authorization.service");
let UserController = UserController_1 = class UserController {
    constructor(userService, userValidator, authorizationService) {
        this.userService = userService;
        this.userValidator = userValidator;
        this.authorizationService = authorizationService;
        this.logger = new common_1.Logger(UserController_1.name);
    }
    async findAll(page = 1, limit = 10, req) {
        const tenantId = req.tenantId;
        const userLevel = req.userLevel;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is required');
        }
        if (userLevel < 8) {
            this.logger.warn(`User with level ${userLevel} attempted to access findAll - access denied`);
            throw new common_1.BadRequestException('Access denied. Admin level (8+) required to view all users.');
        }
        return this.userService.findByTenant(tenantId);
    }
    async findOne(id, req) {
        const userLevel = req.userLevel;
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const targetUser = await this.userService.findByUsername(user.username);
        if (targetUser && userLevel < targetUser.user_level) {
            throw new common_1.BadRequestException('Access denied. Your user level is insufficient to view this user.');
        }
        return user;
    }
    async create(createUserDto) {
        await this.userValidator.validateCreate(createUserDto);
        return this.userService.create(createUserDto);
    }
    async update(id, updateUserDto, req) {
        const tenantId = req.tenantId;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is required');
        }
        const user = await this.userService.findByUsername(updateUserDto.username || '');
        if (user && user.tenant_id !== tenantId) {
            throw new common_1.UnauthorizedException('User does not belong to the specified tenant');
        }
        await this.userValidator.validateUpdate(updateUserDto);
        return this.userService.update(id, updateUserDto);
    }
    async remove(id, req) {
        const tenantId = req.tenantId;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is required');
        }
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const userEntity = await this.userService.findByUsername(user.username);
        if (userEntity && userEntity.user_level === 9) {
            throw new common_1.UnauthorizedException('Cannot delete master user (level 9)');
        }
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with pagination (Admin Only)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated list of users', type: [DTOs_1.UserResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - Admin level required' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user details', type: DTOs_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - Insufficient user level' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully', type: DTOs_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or username already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTOs_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully', type: DTOs_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or username already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DTOs_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cannot delete master user (level 9)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = UserController_1 = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => authorization_service_1.AuthorizationService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_validator_1.UserValidator,
        authorization_service_1.AuthorizationService])
], UserController);
//# sourceMappingURL=user.controller.js.map