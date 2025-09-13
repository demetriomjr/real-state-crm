import { IAuditBase } from "@/Domain/Interfaces/IAuditBase";

export class Contact implements IAuditBase {
  id: string;
  contact_name?: string; // Optional contact name/label
  contact_type: string; // "email", "phone", "cellphone"
  contact_value: string;
  is_whatsapp?: boolean; // WhatsApp toggle for phone/cellphone
  person_id: string;
  is_default?: boolean;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Contact>) {
    this.id = data.id || "";
    this.contact_name = data.contact_name;
    this.contact_type = data.contact_type || "";
    this.contact_value = data.contact_value || "";
    this.is_whatsapp = data.is_whatsapp || false;
    this.person_id = data.person_id || "";
    this.is_default = data.is_default || false;
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
