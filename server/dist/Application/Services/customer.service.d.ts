import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
export declare class CustomerService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: MainDatabaseContext);
    createCustomer(customerData: any, personData: any, userId?: string): Promise<any>;
    updateCustomer(customerId: string, customerData: any, personData: any, userId?: string): Promise<any>;
    getCustomerById(customerId: string): Promise<any>;
    getAllCustomers(page?: number, limit?: number): Promise<any>;
    deleteCustomer(customerId: string, userId?: string): Promise<void>;
    convertLeadToCustomer(leadId: string, customerData: any, userId?: string): Promise<any>;
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
