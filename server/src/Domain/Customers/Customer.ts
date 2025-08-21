import { IAuditBase } from '@/Domain/Interfaces/IAuditBase';

export class Customer implements IAuditBase {
  id: string;
  person_id: string;
  customer_type: string; // "individual", "company"
  customer_status: string; // "active", "inactive"
  fidelized_by?: string; // UUID - can be null
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Customer>) {
    this.id = data.id || '';
    this.person_id = data.person_id || '';
    this.customer_type = data.customer_type || '';
    this.customer_status = data.customer_status || '';
    this.fidelized_by = data.fidelized_by;
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
