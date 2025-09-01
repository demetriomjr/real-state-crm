import { IAudit } from "../Interfaces/IAudit";
export declare class Chat implements IAudit {
    id: string;
    person_id: string;
    contact_name: string;
    contact_phone: string;
    user_observations?: string;
    session_id?: string;
    last_message_at: Date;
    tenant_id: string;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Chat>);
}
