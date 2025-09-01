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
exports.BusinessRepository = void 0;
const common_1 = require("@nestjs/common");
const main_database_context_1 = require("../Database/main-database.context");
const Business_1 = require("../../Domain/Business/Business");
let BusinessRepository = class BusinessRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [businesses, total] = await Promise.all([
            this.prisma.business.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
            }),
            this.prisma.business.count({
                where: { deleted_at: null },
            }),
        ]);
        return {
            businesses: businesses.map((business) => new Business_1.Business(business)),
            total,
        };
    }
    async findOne(id) {
        const business = await this.prisma.business.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
        return business ? new Business_1.Business(business) : null;
    }
    async create(businessData) {
        const business = await this.prisma.business.create({
            data: {
                company_name: businessData.company_name,
                subscription: businessData.subscription || 1,
            },
        });
        return new Business_1.Business(business);
    }
    async update(id, updateBusinessDto) {
        const business = await this.prisma.business.update({
            where: { id },
            data: {
                ...(updateBusinessDto.company_name && {
                    company_name: updateBusinessDto.company_name,
                }),
                ...(updateBusinessDto.subscription !== undefined && {
                    subscription: updateBusinessDto.subscription,
                }),
            },
        });
        return new Business_1.Business(business);
    }
    async remove(id) {
        await this.prisma.business.update({
            where: { id },
            data: {
                deleted_at: new Date(),
                deleted_by: "system",
            },
        });
    }
    async exists(id) {
        const count = await this.prisma.business.count({
            where: {
                id,
                deleted_at: null,
            },
        });
        return count > 0;
    }
    async validateTenantId(tenantId) {
        const count = await this.prisma.business.count({
            where: {
                id: tenantId,
                deleted_at: null,
            },
        });
        return count > 0;
    }
    async purge(id) {
        await this.prisma.business.delete({
            where: { id },
        });
    }
};
exports.BusinessRepository = BusinessRepository;
exports.BusinessRepository = BusinessRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [main_database_context_1.MainDatabaseContext])
], BusinessRepository);
//# sourceMappingURL=business.repository.js.map