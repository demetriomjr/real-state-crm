"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(data) {
        this.id = data.id || "";
        this.chat_id = data.chat_id || "";
        this.user_id = data.user_id;
        this.message_id = data.message_id || "";
        this.message_direction = data.message_direction;
        this.message_type = data.message_type;
        this.message_content = data.message_content || "";
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map