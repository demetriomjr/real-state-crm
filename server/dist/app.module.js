"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./Infrastructure/Database/database.module");
const user_module_1 = require("./Application/Modules/user.module");
const authorization_module_1 = require("./Application/Modules/authorization.module");
const business_module_1 = require("./Application/Modules/business.module");
const lead_module_1 = require("./Application/Modules/lead.module");
const customer_module_1 = require("./Application/Modules/customer.module");
const chat_module_1 = require("./Application/Modules/chat.module");
const feedback_module_1 = require("./Application/Modules/feedback.module");
const integrated_services_module_1 = require("./Application/Modules/integrated-services.module");
const whatsapp_session_module_1 = require("./Application/Modules/whatsapp-session.module");
const sse_chat_module_1 = require("./Application/Modules/sse-chat.module");
const tenant_validation_middleware_1 = require("./Application/Features/tenant-validation.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_validation_middleware_1.TenantValidationMiddleware).forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            authorization_module_1.AuthorizationModule,
            business_module_1.BusinessModule,
            lead_module_1.LeadModule,
            customer_module_1.CustomerModule,
            chat_module_1.ChatModule,
            feedback_module_1.FeedbackModule,
            integrated_services_module_1.IntegratedServicesModule,
            whatsapp_session_module_1.WhatsappSessionModule,
            sse_chat_module_1.SSEChatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map