import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
export declare class LeadService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: MainDatabaseContext);
    createLead(leadData: any, personData: any, userId?: string): Promise<any>;
    updateLead(leadId: string, leadData: any, personData: any, userId?: string): Promise<any>;
    getLeadById(leadId: string): Promise<any>;
    getAllLeads(page?: number, limit?: number): Promise<any>;
    deleteLead(leadId: string, userId?: string): Promise<void>;
    handleAddressPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean>;
    createAddresses(personId: string, addresses: any[], userId?: string): Promise<any[]>;
    updateAddresses(personId: string, addresses: any[], userId?: string): Promise<any[]>;
    handleContactPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean>;
    createContacts(personId: string, contacts: any[], userId?: string): Promise<any[]>;
    updateContacts(personId: string, contacts: any[], userId?: string): Promise<any[]>;
    handleDocumentPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean>;
    createDocuments(personId: string, documents: any[], userId?: string): Promise<any[]>;
    updateDocuments(personId: string, documents: any[], userId?: string): Promise<any[]>;
}
