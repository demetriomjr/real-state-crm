import { IAuditBase } from '@/Domain/Interfaces/IAuditBase';
export declare class Lead implements IAuditBase {
    id: string;
    person_id: string;
    lead_type: string;
    lead_status: string;
    lead_temperature: string;
    lead_origin: string;
    lead_description: string;
    lead_notes: string[];
    first_contacted_by: string;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Lead>);
}
