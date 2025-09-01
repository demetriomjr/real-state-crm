import { IAudit } from "../Interfaces/IAudit";

export class User implements IAudit {
  id: string;
  fullName: string;
  username: string;
  password: string;
  user_level: number;
  tenant_id: string;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<User>) {
    this.id = data.id || "";
    this.fullName = data.fullName || "";
    this.username = data.username || "";
    this.password = data.password || "";
    this.user_level = data.user_level || 1;
    this.tenant_id = data.tenant_id || "";
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Validation method
  validate(): boolean {
    return !!(
      this.fullName &&
      this.username &&
      this.password &&
      this.tenant_id
    );
  }

  // Business logic methods
  isActive(): boolean {
    return !this.deleted_at;
  }

  hasPermission(level: number): boolean {
    return this.user_level >= level;
  }
}
