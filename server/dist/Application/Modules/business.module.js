"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessModule = void 0;
const common_1 = require("@nestjs/common");
const business_controller_1 = require("../Controllers/business.controller");
const business_service_1 = require("../Services/business.service");
const business_repository_1 = require("../../Infrastructure/Repositories/business.repository");
const user_repository_1 = require("../../Infrastructure/Repositories/user.repository");
const authorization_module_1 = require("./authorization.module");
const database_module_1 = require("../../Infrastructure/Database/database.module");
let BusinessModule = class BusinessModule {
};
exports.BusinessModule = BusinessModule;
exports.BusinessModule = BusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [authorization_module_1.AuthorizationModule, database_module_1.DatabaseModule],
        controllers: [business_controller_1.BusinessController],
        providers: [business_service_1.BusinessService, business_repository_1.BusinessRepository, user_repository_1.UserRepository],
        exports: [business_service_1.BusinessService, business_repository_1.BusinessRepository],
    })
], BusinessModule);
//# sourceMappingURL=business.module.js.map