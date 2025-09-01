export class WhatsappSessionResponseDto {
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
  updated_at: Date;
}
