import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { User } from '@/Domain/Users/User';
import { CreateUserDto } from '../DTOs/user-create.dto';
import { UpdateUserDto } from '../DTOs/user-update.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const result = await this.userRepository.findAll(page, limit);
    return {
      ...result,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username already exists
    const existingUser = await this.userRepository.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with hashed password
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.userRepository.create(userData);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If username is being updated, check for conflicts
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
      const userWithUsername = await this.userRepository.findByUsername(updateUserDto.username);
      if (userWithUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(id);
  }

  async findByTenant(tenant_id: string): Promise<User[]> {
    return this.userRepository.findByTenant(tenant_id);
  }
}
