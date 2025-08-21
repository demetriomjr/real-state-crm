"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("../Controllers/user.controller");
const user_service_1 = require("../Services/user.service");
const user_repository_1 = require("../../Infrastructure/Repositories/user.repository");
const user_validator_1 = require("../Validators/user.validator");
const database_module_1 = require("../../Infrastructure/Database/database.module");
const authorization_module_1 = require("./authorization.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, (0, common_1.forwardRef)(() => authorization_module_1.AuthorizationModule)],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, user_repository_1.UserRepository, user_validator_1.UserValidator],
        exports: [user_service_1.UserService, user_repository_1.UserRepository],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map