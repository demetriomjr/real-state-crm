"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
class Feedback {
    constructor(data) {
        this.id = data.id || "";
        this.chat_id = data.chat_id || "";
        this.user_id = data.user_id || "";
        this.feedback_type = data.feedback_type;
        this.generation_type = data.generation_type;
        this.user_prompt = data.user_prompt;
        this.feedback_content = data.feedback_content || "";
        this.tenant_id = data.tenant_id || "";
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
}
exports.Feedback = Feedback;
//# sourceMappingURL=Feedback.js.map