import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { User } from '@/Domain/Users/User';
import { CreateUserDto } from '../DTOs/user-create.dto';
import { UpdateUserDto } from '../DTOs/user-update.dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    findByTenant(tenant_id: string): Promise<User[]>;
}
