"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const common_1 = require("@nestjs/common");
let UserValidator = UserValidator_1 = class UserValidator {
    constructor() {
        this.logger = new common_1.Logger(UserValidator_1.name);
    }
    async validateCreate(createUserDto) {
        const errors = [];
        if (!createUserDto.fullName || createUserDto.fullName.trim().length === 0) {
            errors.push("fullName is required");
        }
        else if (createUserDto.fullName.length < 2) {
            errors.push("fullName must be at least 2 characters long");
        }
        else if (createUserDto.fullName.length > 100) {
            errors.push("fullName must not exceed 100 characters");
        }
        if (!createUserDto.username || createUserDto.username.trim().length === 0) {
            errors.push("username is required");
        }
        else if (createUserDto.username.length < 3) {
            errors.push("username must be at least 3 characters long");
        }
        else if (createUserDto.username.length > 50) {
            errors.push("username must not exceed 50 characters");
        }
        else if (!/^[a-zA-Z0-9_]+$/.test(createUserDto.username)) {
            errors.push("username can only contain letters, numbers, and underscores");
        }
        if (!createUserDto.password || createUserDto.password.length === 0) {
            errors.push("password is required");
        }
        else if (createUserDto.password.length < 6) {
            errors.push("password must be at least 6 characters long");
        }
        else if (createUserDto.password.length > 128) {
            errors.push("password must not exceed 128 characters");
        }
        if (createUserDto.user_level !== undefined) {
            if (!Number.isInteger(createUserDto.user_level)) {
                errors.push("user_level must be an integer");
            }
            else if (createUserDto.user_level < 1 ||
                createUserDto.user_level > 10) {
                errors.push("user_level must be between 1 and 10");
            }
        }
        if (!createUserDto.tenant_id ||
            createUserDto.tenant_id.trim().length === 0) {
            errors.push("tenant_id is required");
        }
        else if (!this.isValidUUID(createUserDto.tenant_id)) {
            errors.push("tenant_id must be a valid UUID");
        }
        if (errors.length > 0) {
            this.logger.error(`Validation failed for user creation: ${JSON.stringify(errors)}`);
            throw new common_1.BadRequestException({
                message: "Validation failed",
                errors,
            });
        }
    }
    async validateUpdate(updateUserDto) {
        const errors = [];
        if (updateUserDto.fullName !== undefined) {
            if (updateUserDto.fullName.trim().length === 0) {
                errors.push("fullName cannot be empty");
            }
            else if (updateUserDto.fullName.length < 2) {
                errors.push("fullName must be at least 2 characters long");
            }
            else if (updateUserDto.fullName.length > 100) {
                errors.push("fullName must not exceed 100 characters");
            }
        }
        if (updateUserDto.username !== undefined) {
            if (updateUserDto.username.trim().length === 0) {
                errors.push("username cannot be empty");
            }
            else if (updateUserDto.username.length < 3) {
                errors.push("username must be at least 3 characters long");
            }
            else if (updateUserDto.username.length > 50) {
                errors.push("username must not exceed 50 characters");
            }
            else if (!/^[a-zA-Z0-9_]+$/.test(updateUserDto.username)) {
                errors.push("username can only contain letters, numbers, and underscores");
            }
        }
        if (updateUserDto.password !== undefined) {
            if (updateUserDto.password.length === 0) {
                errors.push("password cannot be empty");
            }
            else if (updateUserDto.password.length < 6) {
                errors.push("password must be at least 6 characters long");
            }
            else if (updateUserDto.password.length > 128) {
                errors.push("password must not exceed 128 characters");
            }
        }
        if (updateUserDto.user_level !== undefined) {
            if (!Number.isInteger(updateUserDto.user_level)) {
                errors.push("user_level must be an integer");
            }
            else if (updateUserDto.user_level < 1 ||
                updateUserDto.user_level > 10) {
                errors.push("user_level must be between 1 and 10");
            }
        }
        if (updateUserDto.tenant_id !== undefined) {
            if (updateUserDto.tenant_id.trim().length === 0) {
                errors.push("tenant_id cannot be empty");
            }
            else if (!this.isValidUUID(updateUserDto.tenant_id)) {
                errors.push("tenant_id must be a valid UUID");
            }
        }
        if (errors.length > 0) {
            this.logger.error(`Validation failed for user update: ${JSON.stringify(errors)}`);
            throw new common_1.BadRequestException({
                message: "Validation failed",
                errors,
            });
        }
    }
    isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
};
exports.UserValidator = UserValidator;
exports.UserValidator = UserValidator = UserValidator_1 = __decorate([
    (0, common_1.Injectable)()
], UserValidator);
//# sourceMappingURL=user.validator.js.map