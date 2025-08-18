import { IAuditBase } from '../Interfaces/IAuditBase';

export class Business implements IAuditBase {
  id: string;
  company_name: string;
  subscription: number;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Business>) {
    this.id = data.id || '';
    this.company_name = data.company_name || '';
    this.subscription = data.subscription || 0;
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Validation method
  validate(): boolean {
    return !!(this.company_name && this.subscription >= 0);
  }

  // Business logic methods
  isActive(): boolean {
    return !this.deleted_at;
  }

  hasActiveSubscription(): boolean {
    return this.subscription > 0;
  }

  getSubscriptionLevel(): string {
    if (this.subscription >= 10) return 'premium';
    if (this.subscription >= 5) return 'standard';
    return 'basic';
  }
}
