import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { WhatsappSessionCreateDto, WhatsappSessionUpdateDto, WhatsappSessionResponseDto } from "@/Application/DTOs/WhatsappSession";
export declare class WhatsappSessionService {
    private readonly whatsappSessionRepository;
    private readonly logger;
    private readonly wahaBaseUrl;
    constructor(whatsappSessionRepository: WhatsappSessionRepository);
    findAll(tenantId: string): Promise<WhatsappSessionResponseDto[]>;
    findOne(id: string, tenantId: string): Promise<WhatsappSessionResponseDto>;
    create(createSessionDto: WhatsappSessionCreateDto): Promise<WhatsappSessionResponseDto>;
    update(id: string, updateSessionDto: WhatsappSessionUpdateDto, tenantId: string): Promise<WhatsappSessionResponseDto>;
    delete(id: string, tenantId: string): Promise<void>;
    refreshQRCode(id: string, tenantId: string): Promise<WhatsappSessionResponseDto>;
    getSessionState(id: string, tenantId: string): Promise<any>;
    private createWahaSession;
    private startWahaSession;
    private deleteWahaSession;
    private getWahaSessionState;
    private mapSessionToResponseDto;
}
