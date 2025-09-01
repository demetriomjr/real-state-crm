import { IAudit } from "../Interfaces/IAudit";

export class WhatsappSession implements IAudit {
  id: string;
  tenant_id: string;
  session_id: string; // This is the session name in WAHA
  session_name: string; // Human-readable name
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

  constructor(data: Partial<WhatsappSession>) {
    this.id = data.id || "";
    this.tenant_id = data.tenant_id || "";
    this.session_id = data.session_id || "";
    this.session_name = data.session_name || "";
    this.status = data.status || "pending";
    this.qr_code = data.qr_code;
    this.qr_code_expires_at = data.qr_code_expires_at;
    this.phone_number = data.phone_number;
    this.last_activity_at = data.last_activity_at;
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Business logic methods
  isConnected(): boolean {
    return this.status === "connected";
  }

  isQRCodeValid(): boolean {
    if (!this.qr_code || !this.qr_code_expires_at) {
      return false;
    }
    return new Date() < this.qr_code_expires_at;
  }

  needsNewQRCode(): boolean {
    return this.status === "pending" && !this.isQRCodeValid();
  }

  updateActivity(): void {
    this.last_activity_at = new Date();
    this.updated_at = new Date();
  }
}
