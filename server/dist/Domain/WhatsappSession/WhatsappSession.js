"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappSession = void 0;
class WhatsappSession {
    constructor(data) {
        this.id = data.id || "";
        this.tenant_id = data.tenant_id || "";
        this.session_id = data.session_id || "";
        this.session_name = data.session_name || "";
        this.status = data.status || "pending";
        this.qr_code = data.qr_code;
        this.qr_code_expires_at = data.qr_code_expires_at;
        this.phone_number = data.phone_number;
        this.last_activity_at = data.last_activity_at;
        this.created_at = data.created_at || new Date();
        this.created_by = data.created_by;
        this.updated_at = data.updated_at || new Date();
        this.updated_by = data.updated_by;
        this.deleted_at = data.deleted_at;
        this.deleted_by = data.deleted_by;
    }
    isConnected() {
        return this.status === "connected";
    }
    isQRCodeValid() {
        if (!this.qr_code || !this.qr_code_expires_at) {
            return false;
        }
        return new Date() < this.qr_code_expires_at;
    }
    needsNewQRCode() {
        return this.status === "pending" && !this.isQRCodeValid();
    }
    updateActivity() {
        this.last_activity_at = new Date();
        this.updated_at = new Date();
    }
}
exports.WhatsappSession = WhatsappSession;
//# sourceMappingURL=WhatsappSession.js.map