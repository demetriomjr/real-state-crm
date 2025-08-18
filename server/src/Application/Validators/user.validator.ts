import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../DTOs/user-create.dto';
import { UpdateUserDto } from '../DTOs/user-update.dto';

@Injectable()
export class UserValidator {
  async validateCreate(createUserDto: CreateUserDto): Promise<void> {
    const errors: string[] = [];

    // Validate fullName
    if (!createUserDto.fullName || createUserDto.fullName.trim().length === 0) {
      errors.push('fullName is required');
    } else if (createUserDto.fullName.length < 2) {
      errors.push('fullName must be at least 2 characters long');
    } else if (createUserDto.fullName.length > 100) {
      errors.push('fullName must not exceed 100 characters');
    }

    // Validate username
    if (!createUserDto.username || createUserDto.username.trim().length === 0) {
      errors.push('username is required');
    } else if (createUserDto.username.length < 3) {
      errors.push('username must be at least 3 characters long');
    } else if (createUserDto.username.length > 50) {
      errors.push('username must not exceed 50 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(createUserDto.username)) {
      errors.push('username can only contain letters, numbers, and underscores');
    }

    // Validate password
    if (!createUserDto.password || createUserDto.password.length === 0) {
      errors.push('password is required');
    } else if (createUserDto.password.length < 6) {
      errors.push('password must be at least 6 characters long');
    } else if (createUserDto.password.length > 128) {
      errors.push('password must not exceed 128 characters');
    }

    // Validate user_level
    if (createUserDto.user_level !== undefined) {
      if (!Number.isInteger(createUserDto.user_level)) {
        errors.push('user_level must be an integer');
      } else if (createUserDto.user_level < 1 || createUserDto.user_level > 10) {
        errors.push('user_level must be between 1 and 10');
      }
    }

    // Validate tenant_id
    if (!createUserDto.tenant_id || createUserDto.tenant_id.trim().length === 0) {
      errors.push('tenant_id is required');
    } else if (!this.isValidUUID(createUserDto.tenant_id)) {
      errors.push('tenant_id must be a valid UUID');
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
  }

  async validateUpdate(updateUserDto: UpdateUserDto): Promise<void> {
    const errors: string[] = [];

    // Validate fullName if provided
    if (updateUserDto.fullName !== undefined) {
      if (updateUserDto.fullName.trim().length === 0) {
        errors.push('fullName cannot be empty');
      } else if (updateUserDto.fullName.length < 2) {
        errors.push('fullName must be at least 2 characters long');
      } else if (updateUserDto.fullName.length > 100) {
        errors.push('fullName must not exceed 100 characters');
      }
    }

    // Validate username if provided
    if (updateUserDto.username !== undefined) {
      if (updateUserDto.username.trim().length === 0) {
        errors.push('username cannot be empty');
      } else if (updateUserDto.username.length < 3) {
        errors.push('username must be at least 3 characters long');
      } else if (updateUserDto.username.length > 50) {
        errors.push('username must not exceed 50 characters');
      } else if (!/^[a-zA-Z0-9_]+$/.test(updateUserDto.username)) {
        errors.push('username can only contain letters, numbers, and underscores');
      }
    }

    // Validate password if provided
    if (updateUserDto.password !== undefined) {
      if (updateUserDto.password.length === 0) {
        errors.push('password cannot be empty');
      } else if (updateUserDto.password.length < 6) {
        errors.push('password must be at least 6 characters long');
      } else if (updateUserDto.password.length > 128) {
        errors.push('password must not exceed 128 characters');
      }
    }

    // Validate user_level if provided
    if (updateUserDto.user_level !== undefined) {
      if (!Number.isInteger(updateUserDto.user_level)) {
        errors.push('user_level must be an integer');
      } else if (updateUserDto.user_level < 1 || updateUserDto.user_level > 10) {
        errors.push('user_level must be between 1 and 10');
      }
    }

    // Validate tenant_id if provided
    if (updateUserDto.tenant_id !== undefined) {
      if (updateUserDto.tenant_id.trim().length === 0) {
        errors.push('tenant_id cannot be empty');
      } else if (!this.isValidUUID(updateUserDto.tenant_id)) {
        errors.push('tenant_id must be a valid UUID');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
