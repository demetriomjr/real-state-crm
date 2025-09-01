"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadRepository = void 0;
const common_1 = require("@nestjs/common");
const postgres_context_1 = require("../Database/postgres.context");
let LeadRepository = class LeadRepository {
    constructor(context) {
        this.context = context;
    }
    async create(data) {
        return this.context.lead.create({ data });
    }
};
exports.LeadRepository = LeadRepository;
exports.LeadRepository = LeadRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_context_1.PostgresContext])
], LeadRepository);
//# sourceMappingURL=lead.repository.js.map