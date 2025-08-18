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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const postgres_context_1 = require("../Database/postgres.context");
const User_1 = require("../../Domain/Users/User");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.user.count({
                where: { deleted_at: null },
            }),
        ]);
        return {
            users: users.map(user => new User_1.User(user)),
            total,
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
                deleted_at: null
            },
        });
        return user ? new User_1.User(user) : null;
    }
    async findByUsername(username) {
        const user = await this.prisma.user.findFirst({
            where: {
                username,
                deleted_at: null
            },
        });
        return user ? new User_1.User(user) : null;
    }
    async create(createUserDto) {
        const user = await this.prisma.user.create({
            data: {
                fullName: createUserDto.fullName,
                username: createUserDto.username,
                password: createUserDto.password,
                user_level: createUserDto.user_level || 1,
                tenant_id: createUserDto.tenant_id,
            },
        });
        return new User_1.User(user);
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...(updateUserDto.fullName && { fullName: updateUserDto.fullName }),
                ...(updateUserDto.username && { username: updateUserDto.username }),
                ...(updateUserDto.password && { password: updateUserDto.password }),
                ...(updateUserDto.user_level && { user_level: updateUserDto.user_level }),
                ...(updateUserDto.tenant_id && { tenant_id: updateUserDto.tenant_id }),
            },
        });
        return new User_1.User(user);
    }
    async remove(id) {
        await this.prisma.user.update({
            where: { id },
            data: {
                deleted_at: new Date(),
                deleted_by: 'system',
            },
        });
    }
    async exists(id) {
        const count = await this.prisma.user.count({
            where: {
                id,
                deleted_at: null
            },
        });
        return count > 0;
    }
    async findByTenant(tenant_id) {
        const users = await this.prisma.user.findMany({
            where: {
                tenant_id,
                deleted_at: null
            },
            orderBy: { created_at: 'desc' },
        });
        return users.map(user => new User_1.User(user));
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_context_1.PostgresContext])
], UserRepository);
//# sourceMappingURL=user.repository.js.map