"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegratedServicesModule = void 0;
const common_1 = require("@nestjs/common");
const integrated_services_controller_1 = require("../Controllers/integrated-services.controller");
const chat_messaging_service_1 = require("../Services/chat-messaging.service");
const database_module_1 = require("../../Infrastructure/Database/database.module");
let IntegratedServicesModule = class IntegratedServicesModule {
};
exports.IntegratedServicesModule = IntegratedServicesModule;
exports.IntegratedServicesModule = IntegratedServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [integrated_services_controller_1.IntegratedServicesController],
        providers: [
            chat_messaging_service_1.ChatMessagingService
        ],
    })
], IntegratedServicesModule);
//# sourceMappingURL=integrated-services.module.js.map