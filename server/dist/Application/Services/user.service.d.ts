import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
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
    private mapToResponseDto;
}
