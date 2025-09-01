"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappSessionModule = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_session_controller_1 = require("../Controllers/whatsapp-session.controller");
const whatsapp_session_service_1 = require("../Services/whatsapp-session.service");
const whatsapp_session_repository_1 = require("../../Infrastructure/Repositories/whatsapp-session.repository");
const database_module_1 = require("../../Infrastructure/Database/database.module");
let WhatsappSessionModule = class WhatsappSessionModule {
};
exports.WhatsappSessionModule = WhatsappSessionModule;
exports.WhatsappSessionModule = WhatsappSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [whatsapp_session_controller_1.WhatsappSessionController],
        providers: [whatsapp_session_service_1.WhatsappSessionService, whatsapp_session_repository_1.WhatsappSessionRepository],
        exports: [whatsapp_session_service_1.WhatsappSessionService, whatsapp_session_repository_1.WhatsappSessionRepository],
    })
], WhatsappSessionModule);
//# sourceMappingURL=whatsapp-session.module.js.map