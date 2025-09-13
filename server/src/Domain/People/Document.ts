import { IAuditBase } from "@/Domain/Interfaces/IAuditBase";

export class Document implements IAuditBase {
  id: string;
  document_type: string;
  document_number: string;
  person_id: string;
  is_default?: boolean;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Document>) {
    this.id = data.id || "";
    this.document_type = data.document_type || "";
    this.document_number = data.document_number || "";
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
