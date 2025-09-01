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
var WhatsappSessionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappSessionService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_session_repository_1 = require("../../Infrastructure/Repositories/whatsapp-session.repository");
const axios_1 = require("axios");
let WhatsappSessionService = WhatsappSessionService_1 = class WhatsappSessionService {
    constructor(whatsappSessionRepository) {
        this.whatsappSessionRepository = whatsappSessionRepository;
        this.logger = new common_1.Logger(WhatsappSessionService_1.name);
        this.wahaBaseUrl = "http://waha:3000/api";
    }
    async findAll(tenantId) {
        const sessions = await this.whatsappSessionRepository.findAll(tenantId);
        return sessions.map((session) => this.mapSessionToResponseDto(session));
    }
    async findOne(id, tenantId) {
        const session = await this.whatsappSessionRepository.findOne(id);
        if (!session || session.tenant_id !== tenantId) {
            throw new common_1.NotFoundException("WhatsApp session not found");
        }
        return this.mapSessionToResponseDto(session);
    }
    async create(createSessionDto) {
        this.logger.log(`Creating WhatsApp session: ${createSessionDto.session_name}`);
        const session = await this.whatsappSessionRepository.create(createSessionDto);
        try {
            await this.createWahaSession(session.session_id, createSessionDto.phone_number);
            const qrCodeData = await this.startWahaSession(session.session_id);
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 2);
            const updatedSession = await this.whatsappSessionRepository.updateQRCode(session.id, qrCodeData.qr || "", expiresAt);
            this.logger.log(`WhatsApp session created successfully: ${session.session_id}`);
            return this.mapSessionToResponseDto(updatedSession);
        }
        catch (error) {
            await this.whatsappSessionRepository.delete(session.id);
            this.logger.error(`Failed to create WAHA session: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to create WhatsApp session: ${error.message}`);
        }
    }
    async update(id, updateSessionDto, tenantId) {
        const session = await this.whatsappSessionRepository.findOne(id);
        if (!session || session.tenant_id !== tenantId) {
            throw new common_1.NotFoundException("WhatsApp session not found");
        }
        const updatedSession = await this.whatsappSessionRepository.update(id, updateSessionDto);
        return this.mapSessionToResponseDto(updatedSession);
    }
    async delete(id, tenantId) {
        const session = await this.whatsappSessionRepository.findOne(id);
        if (!session || session.tenant_id !== tenantId) {
            throw new common_1.NotFoundException("WhatsApp session not found");
        }
        try {
            await this.deleteWahaSession(session.session_id);
        }
        catch (error) {
            this.logger.warn(`Failed to delete WAHA session: ${error.message}`);
        }
        await this.whatsappSessionRepository.delete(id);
    }
    async refreshQRCode(id, tenantId) {
        const session = await this.whatsappSessionRepository.findOne(id);
        if (!session || session.tenant_id !== tenantId) {
            throw new common_1.NotFoundException("WhatsApp session not found");
        }
        if (session.status === "connected") {
            throw new common_1.BadRequestException("Cannot refresh QR code for connected session");
        }
        try {
            const qrCodeData = await this.startWahaSession(session.session_id);
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 2);
            const updatedSession = await this.whatsappSessionRepository.updateQRCode(session.id, qrCodeData.qr || "", expiresAt);
            return this.mapSessionToResponseDto(updatedSession);
        }
        catch (error) {
            this.logger.error(`Failed to refresh QR code: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to refresh QR code: ${error.message}`);
        }
    }
    async getSessionState(id, tenantId) {
        const session = await this.whatsappSessionRepository.findOne(id);
        if (!session || session.tenant_id !== tenantId) {
            throw new common_1.NotFoundException("WhatsApp session not found");
        }
        try {
            const state = await this.getWahaSessionState(session.session_id);
            return state;
        }
        catch (error) {
            this.logger.error(`Failed to get session state: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to get session state: ${error.message}`);
        }
    }
    async createWahaSession(sessionId, phoneNumber) {
        const payload = {
            name: sessionId,
            config: {
                webhook: "http://n8n:5678/webhook/waha-inbound",
                webhookByEvents: false,
                webhookBase64: false,
            },
        };
        if (phoneNumber) {
            payload.config.phoneNumber = phoneNumber;
        }
        const response = await axios_1.default.post(`${this.wahaBaseUrl}/sessions/add`, payload);
        return response.data;
    }
    async startWahaSession(sessionId) {
        const response = await axios_1.default.get(`${this.wahaBaseUrl}/${sessionId}/start`);
        return response.data;
    }
    async deleteWahaSession(sessionId) {
        await axios_1.default.delete(`${this.wahaBaseUrl}/sessions/${sessionId}`);
    }
    async getWahaSessionState(sessionId) {
        const response = await axios_1.default.get(`${this.wahaBaseUrl}/${sessionId}/state`);
        return response.data;
    }
    mapSessionToResponseDto(session) {
        return {
            id: session.id,
            tenant_id: session.tenant_id,
            session_id: session.session_id,
            session_name: session.session_name,
            status: session.status,
            qr_code: session.qr_code,
            qr_code_expires_at: session.qr_code_expires_at,
            phone_number: session.phone_number,
            last_activity_at: session.last_activity_at,
            created_at: session.created_at,
            updated_at: session.updated_at,
        };
    }
};
exports.WhatsappSessionService = WhatsappSessionService;
exports.WhatsappSessionService = WhatsappSessionService = WhatsappSessionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_session_repository_1.WhatsappSessionRepository])
], WhatsappSessionService);
//# sourceMappingURL=whatsapp-session.service.js.map