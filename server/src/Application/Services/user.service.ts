import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { User } from "@/Domain/Users/User";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "@/Application/DTOs";
import { PersonService } from "./person.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly personService: PersonService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(
      `Fetching users with pagination: page=${page}, limit=${limit}`,
    );
    const result = await this.userRepository.findAll(page, limit);
    return {
      users: result.users.map((user) => this.mapToResponseDto(user)),
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
    this.logger.log(
      `Creating new user with username: ${createUserDto.username}`,
    );

    // Check if username already exists in the same tenant
    const existingUser = await this.userRepository.findByUsername(
      createUserDto.username,
    );
    if (existingUser) {
      this.logger.warn(`Username already exists: ${createUserDto.username}`);
      throw new ConflictException("Username already exists");
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Updating user with ID: ${id}`);

    // Check if user exists
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for update`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If username is being updated, check for conflicts in the same tenant
    if (
      updateUserDto.username &&
      updateUserDto.username !== existingUser.username
    ) {
      const userWithUsername = await this.userRepository.findByUsername(
        updateUserDto.username,
      );
      if (userWithUsername && userWithUsername.id !== id) {
        this.logger.warn(
          `Username already exists during update: ${updateUserDto.username}`,
        );
        throw new ConflictException("Username already exists");
      }
    }

    // Hash password if it's being updated (only if it's not already hashed)
    if (updateUserDto.password) {
      // Check if password is already hashed (starts with $2b$)
      if (!updateUserDto.password.startsWith("$2b$")) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      // If it starts with $2b$, it's already hashed (from password change modal)
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
    return users.map((user) => this.mapToResponseDto(user));
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`Fetching user by username: ${username}`);
    return await this.userRepository.findByUsername(username);
  }

  async findOneRaw(id: string): Promise<User | null> {
    this.logger.log(`Fetching raw user with ID: ${id}`);
    return await this.userRepository.findOne(id);
  }

  async updateProfile(
    id: string,
    updateData: { 
      username?: string; 
      full_name?: string;
      password?: string;
      contacts?: any[];
      documents?: any[];
      addresses?: any[];
    },
  ): Promise<UserResponseDto> {
    this.logger.log(`Updating profile for user with ID: ${id}`);

    // Get the current user
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for profile update`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user data if provided
    if (updateData.username) {
      // Check if username is being changed and if it's available
      if (updateData.username !== existingUser.username) {
        const userWithUsername = await this.userRepository.findByUsername(
          updateData.username,
        );
        if (userWithUsername && userWithUsername.id !== id) {
          this.logger.warn(
            `Username already exists during profile update: ${updateData.username}`,
          );
          throw new ConflictException("Username already exists");
        }
      }
    }

    // Update person data if provided
    if (existingUser.person_id && (
      updateData.full_name !== undefined ||
      updateData.contacts ||
      updateData.documents ||
      updateData.addresses
    )) {
      const personData = {
        full_name: updateData.full_name,
      };

      const subEntitiesData = {
        contacts: updateData.contacts,
        documents: updateData.documents,
        addresses: updateData.addresses,
      };

      await this.personService.updatePerson(
        existingUser.person_id,
        personData,
        subEntitiesData,
      );
    }

    // Update user data (username and password)
    const updateUserDto: UpdateUserDto = {};
    if (updateData.username) {
      updateUserDto.username = updateData.username;
    }
    if (updateData.password) {
      // Password is already hashed, don't hash again
      updateUserDto.password = updateData.password;
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    this.logger.log(`Profile updated successfully for user with ID: ${id}`);
    return this.mapToResponseDto(updatedUser);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      // Person data embedded directly (person is a fragment, not a separate entity)
      full_name: user.person?.full_name || "",
      contacts: user.person?.contacts || [],
      documents: user.person?.documents || [],
      addresses: user.person?.addresses || [],
      // Note: person_id, user_level, tenant_id, password, and all audit fields are concealed for security reasons
    };
  }
}
