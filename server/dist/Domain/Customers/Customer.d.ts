import { IAuditBase } from '@/Domain/Interfaces/IAuditBase';
export declare class Customer implements IAuditBase {
    id: string;
    person_id: string;
    customer_type: string;
    customer_status: string;
    fidelized_by?: string;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Customer>);
}
