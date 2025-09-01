import { IAuditBase } from "../Interfaces/IAuditBase";

export class UserRole implements IAuditBase {
  id: string;
  user_id: string;
  role: string;
  is_allowed: boolean;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<UserRole>) {
    this.id = data.id || "";
    this.user_id = data.user_id || "";
    this.role = data.role || "";
    this.is_allowed = data.is_allowed ?? true;
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Validation method
  validate(): boolean {
    return !!(this.user_id && this.role);
  }

  // Business logic methods
  isActive(): boolean {
    return !this.deleted_at && this.is_allowed;
  }

  hasRole(roleName: string): boolean {
    return this.role === roleName && this.is_allowed;
  }
}
