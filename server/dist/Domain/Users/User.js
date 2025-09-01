"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data) {
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
    validate() {
        return !!(this.fullName &&
            this.username &&
            this.password &&
            this.tenant_id);
    }
    isActive() {
        return !this.deleted_at;
    }
    hasPermission(level) {
        return this.user_level >= level;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map