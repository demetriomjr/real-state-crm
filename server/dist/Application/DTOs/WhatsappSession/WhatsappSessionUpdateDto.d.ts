export declare class WhatsappSessionUpdateDto {
    session_name?: string;
    phone_number?: string;
    status?: "pending" | "connected" | "disconnected" | "error";
    qr_code?: string;
    qr_code_expires_at?: Date;
    last_activity_at?: Date;
}
