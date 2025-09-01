"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor(data) {
        this.id = data.id || "";
        this.person_id = data.person_id || "";
        this.contact_name = data.contact_name || "";
        this.contact_phone = data.contact_phone || "";
        this.user_observations = data.user_observations;
        this.session_id = data.session_id;
        this.last_message_at = data.last_message_at || new Date();
        this.tenant_id = data.tenant_id || "";
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Chat = Chat;
//# sourceMappingURL=Chat.js.map