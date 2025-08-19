"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const authorization_controller_1 = require("../Controllers/authorization.controller");
const authorization_service_1 = require("../Services/authorization.service");
const jwt_strategy_1 = require("../Features/jwt.strategy");
const user_module_1 = require("./user.module");
let AuthorizationModule = class AuthorizationModule {
};
exports.AuthorizationModule = AuthorizationModule;
exports.AuthorizationModule = AuthorizationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            user_module_1.UserModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '30m'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [authorization_controller_1.AuthorizationController],
        providers: [authorization_service_1.AuthorizationService, jwt_strategy_1.JwtStrategy],
        exports: [authorization_service_1.AuthorizationService, jwt_strategy_1.JwtStrategy],
    })
], AuthorizationModule);
//# sourceMappingURL=authorization.module.js.map