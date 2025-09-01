import { IAuditBase } from "@/Domain/Interfaces/IAuditBase";
export declare class Document implements IAuditBase {
    id: string;
    document_type: string;
    document_number: string;
    person_id: string;
    is_primary: boolean;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Document>);
}
