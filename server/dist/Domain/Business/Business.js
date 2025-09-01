"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Business = void 0;
class Business {
    constructor(data) {
        this.id = data.id || "";
        this.company_name = data.company_name || "";
        this.subscription = data.subscription || 0;
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
    validate() {
        return !!(this.company_name && this.subscription >= 0);
    }
    isActive() {
        return !this.deleted_at;
    }
    hasActiveSubscription() {
        return this.subscription > 0;
    }
    getSubscriptionLevel() {
        if (this.subscription >= 10)
            return "premium";
        if (this.subscription >= 5)
            return "standard";
        return "basic";
    }
}
exports.Business = Business;
//# sourceMappingURL=Business.js.map