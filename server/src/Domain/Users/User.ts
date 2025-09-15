import { IAudit } from "../Interfaces/IAudit";

export class User implements IAudit {
  id: string;
  username: string;
  password: string;
  user_level: number;
  tenant_id: string;
  person_id?: string;
  person?: {
    id: string;
    full_name: string;
    tenant_id: string;
    created_at: Date;
    updated_at: Date;
    contacts?: any[];
    documents?: any[];
    addresses?: any[];
  };
  userRoles?: {
    role: string;
  }[];
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<User>) {
    this.id = data.id || "";
    this.username = data.username || "";
    this.password = data.password || "";
    this.user_level = data.user_level || 1;
    this.tenant_id = data.tenant_id || "";
    this.person_id = data.person_id;
    this.person = data.person;
    this.userRoles = data.userRoles;
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Validation method
  validate(): boolean {
    return !!(this.username && this.password && this.tenant_id);
  }

  // Business logic methods
  isActive(): boolean {
    return !this.deleted_at;
  }

  hasPermission(level: number): boolean {
    return this.user_level >= level;
  }
}
