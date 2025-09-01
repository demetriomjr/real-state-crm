"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
class UserRole {
    constructor(data) {
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
    validate() {
        return !!(this.user_id && this.role);
    }
    isActive() {
        return !this.deleted_at && this.is_allowed;
    }
    hasRole(roleName) {
        return this.role === roleName && this.is_allowed;
    }
}
exports.UserRole = UserRole;
//# sourceMappingURL=UserRole.js.map