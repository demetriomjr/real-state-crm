import { PrismaService } from '@/Infrastructure/Database/postgres.context';
export declare class SubTableService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleAddressPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean>;
    handleContactPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean>;
    handleDocumentPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean>;
    createAddresses(personId: string, addresses: any[], userId?: string): Promise<any[]>;
    createContacts(personId: string, contacts: any[], userId?: string): Promise<any[]>;
    createDocuments(personId: string, documents: any[], userId?: string): Promise<any[]>;
    updateAddresses(personId: string, addresses: any[], userId?: string): Promise<any[]>;
    updateContacts(personId: string, contacts: any[], userId?: string): Promise<any[]>;
    updateDocuments(personId: string, documents: any[], userId?: string): Promise<any[]>;
}
