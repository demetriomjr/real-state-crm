import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { WhatsappSession } from "@/Domain/WhatsappSession/WhatsappSession";
import { WhatsappSessionCreateDto, WhatsappSessionUpdateDto } from "@/Application/DTOs/WhatsappSession";
export declare class WhatsappSessionRepository {
    private readonly prisma;
    constructor(prisma: MainDatabaseContext);
    findAll(tenantId: string): Promise<WhatsappSession[]>;
    findOne(id: string): Promise<WhatsappSession | null>;
    findBySessionId(sessionId: string): Promise<WhatsappSession | null>;
    findByTenantAndSessionId(tenantId: string, sessionId: string): Promise<WhatsappSession | null>;
    create(createSessionDto: WhatsappSessionCreateDto): Promise<WhatsappSession>;
    update(id: string, updateSessionDto: WhatsappSessionUpdateDto): Promise<WhatsappSession>;
    delete(id: string): Promise<void>;
    updateQRCode(id: string, qrCode: string, expiresAt: Date): Promise<WhatsappSession>;
    updateStatus(id: string, status: string): Promise<WhatsappSession>;
    updatePhoneNumber(id: string, phoneNumber: string): Promise<WhatsappSession>;
}
