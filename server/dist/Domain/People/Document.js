"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
class Document {
    constructor(data) {
        this.id = data.id || '';
        this.document_type = data.document_type || '';
        this.document_number = data.document_number || '';
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
exports.Document = Document;
//# sourceMappingURL=Document.js.map