import { IAuditBase } from "@/Domain/Interfaces/IAuditBase";
export declare class Address implements IAuditBase {
    id: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    district: string;
    person_id: string;
    is_primary: boolean;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Address>);
}
