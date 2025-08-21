import { IAudit } from '@/Domain/Interfaces/IAudit';
import { Document } from './Document';
import { Contact } from './Contact';
import { Address } from './Address';

export class Person implements IAudit {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string;
  tenant_id: string;
  other_documents: Document[];
  contacts: Contact[];
  addresses: Address[];
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Person>) {
    this.id = data.id || '';
    this.full_name = data.full_name || '';
    this.document_type = data.document_type || '';
    this.document_number = data.document_number || '';
    this.tenant_id = data.tenant_id || '';
    this.other_documents = data.other_documents || [];
    this.contacts = data.contacts || [];
    this.addresses = data.addresses || [];
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
