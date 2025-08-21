"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    constructor(data) {
        this.id = data.id || '';
        this.address_line_1 = data.address_line_1 || '';
        this.address_line_2 = data.address_line_2 || '';
        this.city = data.city || '';
        this.state = data.state || '';
        this.country = data.country || '';
        this.zip_code = data.zip_code || '';
        this.district = data.district || '';
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
exports.Address = Address;
//# sourceMappingURL=Address.js.map