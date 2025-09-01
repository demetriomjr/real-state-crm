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
var AuthorizationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authorization_service_1 = require("../Services/authorization.service");
const Authorization_1 = require("../DTOs/Authorization");
let AuthorizationController = AuthorizationController_1 = class AuthorizationController {
    constructor(authorizationService) {
        this.authorizationService = authorizationService;
        this.logger = new common_1.Logger(AuthorizationController_1.name);
    }
    async login(authRequest) {
        this.logger.log(`Login attempt for username: ${authRequest.username}`);
        const user = await this.authorizationService.validateUser(authRequest.username, authRequest.password);
        if (!user) {
            this.logger.warn(`Login failed for username: ${authRequest.username}`);
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        this.logger.log(`Login successful for username: ${authRequest.username}`);
        return this.authorizationService.createToken(user);
    }
    async logout(authHeader) {
        this.logger.log("Logout attempt");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            this.logger.warn("Logout failed: Invalid authorization header");
            throw new common_1.UnauthorizedException("Invalid authorization header");
        }
        const token = authHeader.substring(7);
        try {
            await this.authorizationService.validateToken(token);
            this.authorizationService.invalidateToken(token);
            this.logger.log("Logout successful");
            return { message: "Logout successful" };
        }
        catch (error) {
            this.logger.warn(`Logout failed: ${error.message}`);
            throw new common_1.UnauthorizedException("Invalid token");
        }
    }
    async refresh(authHeader) {
        this.logger.log("Token refresh attempt");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            this.logger.warn("Token refresh failed: Invalid authorization header");
            throw new common_1.UnauthorizedException("Invalid authorization header");
        }
        const token = authHeader.substring(7);
        try {
            const result = await this.authorizationService.refreshToken(token);
            this.logger.log("Token refresh successful");
            return result;
        }
        catch (error) {
            this.logger.warn(`Token refresh failed: ${error.message}`);
            throw error;
        }
    }
};
exports.AuthorizationController = AuthorizationController;
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Authenticate user and return JWT token" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Login successful",
        type: Authorization_1.AuthorizationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Authorization_1.AuthorizationRequestDto]),
    __metadata("design:returntype", Promise)
], AuthorizationController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Logout user and invalidate JWT token" }),
    (0, swagger_1.ApiHeader)({
        name: "Authorization",
        description: "Bearer token",
        required: true,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Logout successful" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthorizationController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Refresh JWT token" }),
    (0, swagger_1.ApiHeader)({
        name: "Authorization",
        description: "Bearer token",
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Token refreshed successfully",
        type: Authorization_1.AuthorizationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthorizationController.prototype, "refresh", null);
exports.AuthorizationController = AuthorizationController = AuthorizationController_1 = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [authorization_service_1.AuthorizationService])
], AuthorizationController);
//# sourceMappingURL=authorization.controller.js.map