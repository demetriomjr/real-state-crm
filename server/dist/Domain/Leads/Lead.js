"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
class Lead {
    constructor(data) {
        this.id = data.id || "";
        this.person_id = data.person_id || "";
        this.lead_type = data.lead_type || "";
        this.lead_status = data.lead_status || "";
        this.lead_temperature = data.lead_temperature || "";
        this.lead_origin = data.lead_origin || "";
        this.lead_description = data.lead_description || "";
        this.lead_notes = data.lead_notes || [];
        this.first_contacted_by = data.first_contacted_by || "";
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Lead = Lead;
//# sourceMappingURL=Lead.js.map