"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
class Person {
    constructor(data) {
        this.id = data.id || '';
        this.full_name = data.full_name || '';
        this.document_type = data.document_type || '';
        this.document_number = data.document_number || '';
        this.tenant_id = data.tenant_id || '';
        this.other_documents = data.other_documents || [];
        this.contacts = data.contacts || [];
        this.addresses = data.addresses || [];
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Person = Person;
//# sourceMappingURL=Person.js.map