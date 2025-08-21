"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
class Contact {
    constructor(data) {
        this.id = data.id || '';
        this.contact_type = data.contact_type || '';
        this.contact_value = data.contact_value || '';
        this.person_id = data.person_id || '';
        this.is_primary = data.is_primary || false;
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Contact = Contact;
//# sourceMappingURL=Contact.js.map