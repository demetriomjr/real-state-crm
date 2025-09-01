"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEChatModule = void 0;
const common_1 = require("@nestjs/common");
const sse_chat_controller_1 = require("../Controllers/sse-chat.controller");
const sse_chat_service_1 = require("../Services/sse-chat.service");
let SSEChatModule = class SSEChatModule {
};
exports.SSEChatModule = SSEChatModule;
exports.SSEChatModule = SSEChatModule = __decorate([
    (0, common_1.Module)({
        controllers: [sse_chat_controller_1.SSEChatController],
        providers: [sse_chat_service_1.SSEChatService],
        exports: [sse_chat_service_1.SSEChatService],
    })
], SSEChatModule);
//# sourceMappingURL=sse-chat.module.js.map