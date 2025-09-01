import { WhatsappSessionService } from "@/Application/Services/whatsapp-session.service";
import { WhatsappSessionCreateDto, WhatsappSessionUpdateDto, WhatsappSessionResponseDto } from "@/Application/DTOs/WhatsappSession";
export declare class WhatsappSessionController {
    private readonly whatsappSessionService;
    private readonly logger;
    constructor(whatsappSessionService: WhatsappSessionService);
    findAll(tenantId: string): Promise<WhatsappSessionResponseDto[]>;
    findOne(id: string, tenantId: string): Promise<WhatsappSessionResponseDto>;
    create(createSessionDto: WhatsappSessionCreateDto, tenantId: string): Promise<WhatsappSessionResponseDto>;
    update(id: string, updateSessionDto: WhatsappSessionUpdateDto, tenantId: string): Promise<WhatsappSessionResponseDto>;
    delete(id: string, tenantId: string): Promise<void>;
    refreshQRCode(id: string, tenantId: string): Promise<WhatsappSessionResponseDto>;
    getSessionState(id: string, tenantId: string): Promise<any>;
}
