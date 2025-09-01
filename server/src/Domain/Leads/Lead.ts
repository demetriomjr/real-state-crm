import { IAuditBase } from "@/Domain/Interfaces/IAuditBase";

export class Lead implements IAuditBase {
  id: string;
  person_id: string;
  lead_type: string; // "customer", "prospect"
  lead_status: string; // "new", "contacted", "qualified", "won", "lost"
  lead_temperature: string; // "hot", "warm", "cold"
  lead_origin: string; // "website", "email", "phone", "whatsapp", "cellphone", "other"
  lead_description: string; // blob
  lead_notes: string[];
  first_contacted_by: string; // UUID
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Lead>) {
    this.id = data.id || "";
    this.person_id = data.person_id || "";
    this.lead_type = data.lead_type || "";
    this.lead_status = data.lead_status || "";
    this.lead_temperature = data.lead_temperature || "";
    this.lead_origin = data.lead_origin || "";
    this.lead_description = data.lead_description || "";
    this.lead_notes = data.lead_notes || [];
    this.first_contacted_by = data.first_contacted_by || "";
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
