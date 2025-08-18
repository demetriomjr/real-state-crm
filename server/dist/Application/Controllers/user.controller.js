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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../Services/user.service");
const user_create_dto_1 = require("../DTOs/user-create.dto");
const user_update_dto_1 = require("../DTOs/user-update.dto");
const user_validator_1 = require("../Validators/user.validator");
let UserController = class UserController {
    constructor(userService, userValidator) {
        this.userService = userService;
        this.userValidator = userValidator;
    }
    async findAll(page = 1, limit = 10) {
        return this.userService.findAll(page, limit);
    }
    async findOne(id) {
        return this.userService.findOne(id);
    }
    async create(createUserDto) {
        await this.userValidator.validateCreate(createUserDto);
        return this.userService.create(createUserDto);
    }
    async update(id, updateUserDto) {
        await this.userValidator.validateUpdate(updateUserDto);
        return this.userService.update(id, updateUserDto);
    }
    async remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated list of users' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or username already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or username already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_update_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_validator_1.UserValidator])
], UserController);
//# sourceMappingURL=user.controller.js.map