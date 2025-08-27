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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TestAuthGuard = class TestAuthGuard {
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const nodeEnv = this.configService.get('NODE_ENV');
        if (nodeEnv === 'test') {
            const request = context.switchToHttp().getRequest();
            let tenantId = 'test-tenant-id';
            const urlParams = request.params;
            if (urlParams && urlParams.id) {
                tenantId = urlParams.id;
            }
            request.tenantId = tenantId;
            request.userId = 'test-user-id';
            request.userLevel = 10;
            request.user = {
                tenant_id: tenantId,
                user_id: 'test-user-id',
                user_level: 10,
            };
            console.log(`TestAuthGuard: Allowing access in test environment with tenantId: ${tenantId}`);
            return true;
        }
        console.log(`TestAuthGuard: Denying access in ${nodeEnv} environment`);
        return false;
    }
};
exports.TestAuthGuard = TestAuthGuard;
exports.TestAuthGuard = TestAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TestAuthGuard);
//# sourceMappingURL=test-auth.guard.js.map