export class WhatsappSessionResponseDto {
  id: string;
  tenant_id: string;
  session_name: string;
  status: "pending" | "connected" | "disconnected" | "error";
  phone_number?: string;
  last_activity_at?: Date;
  created_at: Date;
  updated_at: Date;
}
