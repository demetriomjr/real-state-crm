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
exports.WhatsappSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const main_database_context_1 = require("../Database/main-database.context");
const WhatsappSession_1 = require("../../Domain/WhatsappSession/WhatsappSession");
let WhatsappSessionRepository = class WhatsappSessionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        const sessions = await this.prisma.whatsappSession.findMany({
            where: {
                tenant_id: tenantId,
                deleted_at: null,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return sessions.map((session) => new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        }));
    }
    async findOne(id) {
        const session = await this.prisma.whatsappSession.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
        return session ? new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        }) : null;
    }
    async findBySessionId(sessionId) {
        const session = await this.prisma.whatsappSession.findFirst({
            where: {
                session_id: sessionId,
                deleted_at: null,
            },
        });
        return session ? new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        }) : null;
    }
    async findByTenantAndSessionId(tenantId, sessionId) {
        const session = await this.prisma.whatsappSession.findFirst({
            where: {
                tenant_id: tenantId,
                session_id: sessionId,
                deleted_at: null,
            },
        });
        return session ? new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        }) : null;
    }
    async create(createSessionDto) {
        const session = await this.prisma.whatsappSession.create({
            data: {
                tenant_id: createSessionDto.tenant_id,
                session_id: createSessionDto.session_name.toLowerCase().replace(/\s+/g, "-"),
                session_name: createSessionDto.session_name,
                phone_number: createSessionDto.phone_number,
                status: "pending",
            },
        });
        return new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        });
    }
    async update(id, updateSessionDto) {
        const session = await this.prisma.whatsappSession.update({
            where: { id },
            data: {
                ...(updateSessionDto.session_name && {
                    session_name: updateSessionDto.session_name,
                }),
                ...(updateSessionDto.phone_number && {
                    phone_number: updateSessionDto.phone_number,
                }),
                ...(updateSessionDto.status && {
                    status: updateSessionDto.status,
                }),
                ...(updateSessionDto.qr_code && {
                    qr_code: updateSessionDto.qr_code,
                }),
                ...(updateSessionDto.qr_code_expires_at && {
                    qr_code_expires_at: updateSessionDto.qr_code_expires_at,
                }),
                ...(updateSessionDto.last_activity_at && {
                    last_activity_at: updateSessionDto.last_activity_at,
                }),
            },
        });
        return new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        });
    }
    async delete(id) {
        await this.prisma.whatsappSession.update({
            where: { id },
            data: {
                deleted_at: new Date(),
            },
        });
    }
    async updateQRCode(id, qrCode, expiresAt) {
        const session = await this.prisma.whatsappSession.update({
            where: { id },
            data: {
                qr_code: qrCode,
                qr_code_expires_at: expiresAt,
                status: "pending",
            },
        });
        return new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        });
    }
    async updateStatus(id, status) {
        const session = await this.prisma.whatsappSession.update({
            where: { id },
            data: {
                status,
                last_activity_at: new Date(),
            },
        });
        return new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        });
    }
    async updatePhoneNumber(id, phoneNumber) {
        const session = await this.prisma.whatsappSession.update({
            where: { id },
            data: {
                phone_number: phoneNumber,
                last_activity_at: new Date(),
            },
        });
        return new WhatsappSession_1.WhatsappSession({
            ...session,
            status: session.status
        });
    }
};
exports.WhatsappSessionRepository = WhatsappSessionRepository;
exports.WhatsappSessionRepository = WhatsappSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [main_database_context_1.MainDatabaseContext])
], WhatsappSessionRepository);
//# sourceMappingURL=whatsapp-session.repository.js.map