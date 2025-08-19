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
var AuthorizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const user_service_1 = require("./user.service");
let AuthorizationService = AuthorizationService_1 = class AuthorizationService {
    constructor(jwtService, userService, configService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthorizationService_1.name);
        this.expiredTokensCache = new Set();
        this.maxCacheSize = 100;
    }
    async validateUser(username, password) {
        try {
            const user = await this.userService.findByUsername(username);
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async createToken(user) {
        this.logger.log(`Creating token for user: ${user.username}`);
        const payload = {
            tenant_id: user.tenant_id,
            username: user.username,
        };
        const expiresIn = this.configService.get('JWT_EXPIRES_IN', '30m');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        const token = this.jwtService.sign(payload, {
            expiresIn,
            secret: this.configService.get('JWT_SECRET'),
        });
        return {
            token,
            expires_at: expiresAt,
        };
    }
    async validateToken(token) {
        if (this.expiredTokensCache.has(token)) {
            this.logger.warn('Attempted to use invalidated token');
            throw new common_1.UnauthorizedException('Token has been invalidated');
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            const user = await this.userService.findByUsername(payload.username);
            if (!user || user.tenant_id !== payload.tenant_id) {
                this.logger.warn(`Token validation failed: User ${payload.username} not found or tenant mismatch`);
                throw new common_1.UnauthorizedException('User not found');
            }
            this.logger.log(`Token validated for user: ${payload.username}`);
            return payload;
        }
        catch (error) {
            this.logger.error(`Token validation failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async refreshToken(token) {
        this.logger.log('Refreshing token');
        const payload = await this.validateToken(token);
        const user = await this.userService.findByUsername(payload.username);
        if (!user || user.tenant_id !== payload.tenant_id) {
            this.logger.warn(`Token refresh failed: User ${payload.username} not found or tenant mismatch`);
            throw new common_1.UnauthorizedException('User not found');
        }
        this.invalidateToken(token);
        this.logger.log(`Token refreshed for user: ${payload.username}`);
        return this.createToken(user);
    }
    invalidateToken(token) {
        this.logger.log('Invalidating token');
        this.expiredTokensCache.add(token);
        if (this.expiredTokensCache.size > this.maxCacheSize) {
            const tokensArray = Array.from(this.expiredTokensCache);
            const oldestToken = tokensArray[0];
            this.expiredTokensCache.delete(oldestToken);
            this.logger.log('Token cache cleanup performed');
        }
    }
    isDevelopmentEnvironment() {
        return this.configService.get('NODE_ENV') === 'development';
    }
};
exports.AuthorizationService = AuthorizationService;
exports.AuthorizationService = AuthorizationService = AuthorizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        config_1.ConfigService])
], AuthorizationService);
//# sourceMappingURL=authorization.service.js.map