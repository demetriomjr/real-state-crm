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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../../Infrastructure/Repositories/user.repository");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll(page = 1, limit = 10) {
        const result = await this.userRepository.findAll(page, limit);
        return {
            ...result,
            page,
            limit,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findByUsername(createUserDto.username);
        if (existingUser) {
            throw new common_1.ConflictException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const userData = {
            ...createUserDto,
            password: hashedPassword,
        };
        return this.userRepository.create(userData);
    }
    async update(id, updateUserDto) {
        const existingUser = await this.userRepository.findOne(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
            const userWithUsername = await this.userRepository.findByUsername(updateUserDto.username);
            if (userWithUsername) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userRepository.update(id, updateUserDto);
    }
    async remove(id) {
        const existingUser = await this.userRepository.findOne(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepository.remove(id);
    }
    async findByTenant(tenant_id) {
        return this.userRepository.findByTenant(tenant_id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map