import { IAuditBase } from "../Interfaces/IAuditBase";

export class Chat implements IAuditBase {
  id: string;
  person_id?: string;
  contact_name: string;
  contact_phone: string;
  user_observations?: string;
  session_id: string;
  last_message_at: Date;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Chat>) {
    this.id = data.id || "";
    this.person_id = data.person_id;
    this.contact_name = data.contact_name || "";
    this.contact_phone = data.contact_phone || "";
    this.user_observations = data.user_observations;
    this.session_id = data.session_id || "";
    this.last_message_at = data.last_message_at || new Date();
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
