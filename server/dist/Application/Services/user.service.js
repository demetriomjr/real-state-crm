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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../../Infrastructure/Repositories/user.repository");
const bcrypt = require("bcryptjs");
let UserService = UserService_1 = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async findAll(page = 1, limit = 10) {
        this.logger.log(`Fetching users with pagination: page=${page}, limit=${limit}`);
        const result = await this.userRepository.findAll(page, limit);
        return {
            users: result.users.map(user => this.mapToResponseDto(user)),
            total: result.total,
            page,
            limit,
        };
    }
    async findOne(id) {
        this.logger.log(`Fetching user with ID: ${id}`);
        const user = await this.userRepository.findOne(id);
        if (!user) {
            this.logger.warn(`User with ID ${id} not found`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.mapToResponseDto(user);
    }
    async create(createUserDto) {
        this.logger.log(`Creating new user with username: ${createUserDto.username}`);
        const existingUser = await this.userRepository.findByUsername(createUserDto.username);
        if (existingUser) {
            this.logger.warn(`Username already exists: ${createUserDto.username}`);
            throw new common_1.ConflictException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const userData = {
            ...createUserDto,
            password: hashedPassword,
        };
        const user = await this.userRepository.create(userData);
        this.logger.log(`User created successfully with ID: ${user.id}`);
        return this.mapToResponseDto(user);
    }
    async update(id, updateUserDto) {
        this.logger.log(`Updating user with ID: ${id}`);
        const existingUser = await this.userRepository.findOne(id);
        if (!existingUser) {
            this.logger.warn(`User with ID ${id} not found for update`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
            const userWithUsername = await this.userRepository.findByUsername(updateUserDto.username);
            if (userWithUsername) {
                this.logger.warn(`Username already exists during update: ${updateUserDto.username}`);
                throw new common_1.ConflictException('Username already exists');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const user = await this.userRepository.update(id, updateUserDto);
        this.logger.log(`User updated successfully with ID: ${user.id}`);
        return this.mapToResponseDto(user);
    }
    async remove(id) {
        this.logger.log(`Removing user with ID: ${id}`);
        const existingUser = await this.userRepository.findOne(id);
        if (!existingUser) {
            this.logger.warn(`User with ID ${id} not found for removal`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepository.remove(id);
        this.logger.log(`User removed successfully with ID: ${id}`);
    }
    async findByTenant(tenant_id) {
        this.logger.log(`Fetching users for tenant: ${tenant_id}`);
        const users = await this.userRepository.findByTenant(tenant_id);
        return users.map(user => this.mapToResponseDto(user));
    }
    async findByUsername(username) {
        this.logger.log(`Fetching user by username: ${username}`);
        return await this.userRepository.findByUsername(username);
    }
    mapToResponseDto(user) {
        return {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            created_at: user.created_at,
            created_by: user.created_by,
            updated_at: user.updated_at,
            updated_by: user.updated_by,
            deleted_at: user.deleted_at,
            deleted_by: user.deleted_by,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map