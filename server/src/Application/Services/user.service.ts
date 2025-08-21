import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { User } from '@/Domain/Users/User';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/Application/DTOs';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: UserResponseDto[]; total: number; page: number; limit: number }> {
    this.logger.log(`Fetching users with pagination: page=${page}, limit=${limit}`);
    const result = await this.userRepository.findAll(page, limit);
    return {
      users: result.users.map(user => this.mapToResponseDto(user)),
      total: result.total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating new user with username: ${createUserDto.username}`);
    
    // Check if username already exists
    const existingUser = await this.userRepository.findByUsername(createUserDto.username);
    if (existingUser) {
      this.logger.warn(`Username already exists: ${createUserDto.username}`);
      throw new ConflictException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with hashed password
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = await this.userRepository.create(userData);
    this.logger.log(`User created successfully with ID: ${user.id}`);
    return this.mapToResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user with ID: ${id}`);
    
    // Check if user exists
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for update`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If username is being updated, check for conflicts
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
      const userWithUsername = await this.userRepository.findByUsername(updateUserDto.username);
      if (userWithUsername) {
        this.logger.warn(`Username already exists during update: ${updateUserDto.username}`);
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userRepository.update(id, updateUserDto);
    this.logger.log(`User updated successfully with ID: ${user.id}`);
    return this.mapToResponseDto(user);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);
    
    // Check if user exists
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for removal`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(id);
    this.logger.log(`User removed successfully with ID: ${id}`);
  }

  async findByTenant(tenant_id: string): Promise<UserResponseDto[]> {
    this.logger.log(`Fetching users for tenant: ${tenant_id}`);
    const users = await this.userRepository.findByTenant(tenant_id);
    return users.map(user => this.mapToResponseDto(user));
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`Fetching user by username: ${username}`);
    return await this.userRepository.findByUsername(username);
  }

  async findOneRaw(id: string): Promise<User | null> {
    this.logger.log(`Fetching raw user with ID: ${id}`);
    return await this.userRepository.findOne(id);
  }

  /**
   * PURGE - Permanently delete user and all related entities
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   * NOT EXPOSED TO CONTROLLERS - Service level only
   */
  async purge(id: string): Promise<void> {
    this.logger.warn(`PURGING user with ID: ${id} - PERMANENT DELETION`);
    
    // Check if user exists
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for purge`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Get the user's tenant_id for related entity cleanup
    const tenantId = existingUser.tenant_id;

    // Purge related entities first (respecting foreign key constraints)
    await this.userRepository.purgeUserRoles(id);
    
    // Finally purge the user
    await this.userRepository.purge(id);
    
    this.logger.warn(`User PURGED permanently with ID: ${id} from tenant: ${tenantId}`);
  }

  /**
   * PURGE BY TENANT - Permanently delete all users in a tenant
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   * NOT EXPOSED TO CONTROLLERS - Service level only
   */
  async purgeByTenant(tenant_id: string): Promise<void> {
    this.logger.warn(`PURGING all users for tenant: ${tenant_id} - PERMANENT DELETION`);
    
    // Get all users in the tenant
    const users = await this.userRepository.findByTenant(tenant_id);
    
    // Purge each user individually to ensure proper cleanup
    for (const user of users) {
      await this.purge(user.id);
    }
    
    this.logger.warn(`All users PURGED permanently for tenant: ${tenant_id}`);
  }

  private mapToResponseDto(user: User): UserResponseDto {
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
}
