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
exports.PrismaService = exports.MainDatabaseContext = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let MainDatabaseContext = class MainDatabaseContext extends client_1.PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL ||
                        "postgresql://postgres:postgres@localhost:5432/real_state_crm",
                },
            },
            log: ["query", "info", "warn", "error"],
        });
    }
    async onModuleInit() {
        await this.$connect();
        console.log("Main database connected successfully");
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log("Main database disconnected");
    }
    async $beforeCreate(params) {
        const now = new Date();
        const userId = this.getCurrentUserId();
        if (params.data) {
            params.data.created_at = now;
            params.data.updated_at = now;
            params.data.created_by = userId;
            params.data.updated_by = userId;
        }
    }
    async $beforeUpdate(params) {
        const now = new Date();
        const userId = this.getCurrentUserId();
        if (params.data) {
            params.data.updated_at = now;
            params.data.updated_by = userId;
        }
    }
    async $beforeDelete(params) {
        const now = new Date();
        const userId = this.getCurrentUserId();
        if (params.action === "delete") {
            params.action = "update";
            params.args.data = {
                deleted_at: now,
                deleted_by: userId,
            };
        }
    }
    getCurrentUserId() {
        return "system";
    }
};
exports.MainDatabaseContext = MainDatabaseContext;
exports.PrismaService = MainDatabaseContext;
exports.PrismaService = exports.MainDatabaseContext = MainDatabaseContext = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MainDatabaseContext);
//# sourceMappingURL=main-database.context.js.map