import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { User } from '@/Domain/Users/User';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/Application/DTOs';
export declare class UserService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: UserRepository);
    findAll(page?: number, limit?: number): Promise<{
        users: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
    findByTenant(tenant_id: string): Promise<UserResponseDto[]>;
    findByUsername(username: string): Promise<User | null>;
    findOneRaw(id: string): Promise<User | null>;
    purge(id: string): Promise<void>;
    purgeByTenant(tenant_id: string): Promise<void>;
    private mapToResponseDto;
}
