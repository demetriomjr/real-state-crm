import { IAudit } from "../Interfaces/IAudit";
export declare class WhatsappSession implements IAudit {
    id: string;
    tenant_id: string;
    session_id: string;
    session_name: string;
    status: "pending" | "connected" | "disconnected" | "error";
    qr_code?: string;
    qr_code_expires_at?: Date;
    phone_number?: string;
    last_activity_at?: Date;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<WhatsappSession>);
    isConnected(): boolean;
    isQRCodeValid(): boolean;
    needsNewQRCode(): boolean;
    updateActivity(): void;
}
