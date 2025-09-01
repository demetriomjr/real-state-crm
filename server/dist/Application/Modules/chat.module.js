"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_controller_1 = require("../Controllers/chat.controller");
const chat_service_1 = require("../Services/chat.service");
const chat_repository_1 = require("../../Infrastructure/Repositories/chat.repository");
const message_repository_1 = require("../../Infrastructure/Repositories/message.repository");
const chat_validator_1 = require("../Validators/chat.validator");
const database_module_1 = require("../../Infrastructure/Database/database.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_service_1.ChatService,
            chat_repository_1.ChatRepository,
            message_repository_1.MessageRepository,
            chat_validator_1.ChatValidator,
        ],
        exports: [chat_service_1.ChatService, chat_repository_1.ChatRepository, message_repository_1.MessageRepository],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map