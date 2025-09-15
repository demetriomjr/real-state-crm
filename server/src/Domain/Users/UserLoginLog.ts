export class UserLoginLog {
  id: string;
  user_id: string;
  tenant_id: string;
  login_at: Date;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  created_at: Date;

  constructor(data: Partial<UserLoginLog>) {
    this.id = data.id || "";
    this.user_id = data.user_id || "";
    this.tenant_id = data.tenant_id || "";
    this.login_at = data.login_at || new Date();
    this.ip_address = data.ip_address;
    this.user_agent = data.user_agent;
    this.success = data.success !== undefined ? data.success : true;
    this.failure_reason = data.failure_reason;
    this.created_at = data.created_at || new Date();
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.user_id) {
      errors.push("user_id is required");
    }

    if (!this.tenant_id) {
      errors.push("tenant_id is required");
    }

    if (!this.login_at) {
      errors.push("login_at is required");
    }

    return errors;
  }
}
