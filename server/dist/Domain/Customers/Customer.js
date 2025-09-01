"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    constructor(data) {
        this.id = data.id || "";
        this.person_id = data.person_id || "";
        this.customer_type = data.customer_type || "";
        this.customer_status = data.customer_status || "";
        this.fidelized_by = data.fidelized_by;
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Customer = Customer;
//# sourceMappingURL=Customer.js.map