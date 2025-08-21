import { IAudit } from '@/Domain/Interfaces/IAudit';
import { Document } from './Document';
import { Contact } from './Contact';
import { Address } from './Address';
export declare class Person implements IAudit {
    id: string;
    full_name: string;
    document_type: string;
    document_number: string;
    tenant_id: string;
    other_documents: Document[];
    contacts: Contact[];
    addresses: Address[];
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Person>);
}
