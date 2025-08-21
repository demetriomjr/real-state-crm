import { PostgresContext } from '@/Infrastructure/Database/postgres.context';
import { User } from '@/Domain/Users/User';
import { CreateUserDto, UpdateUserDto } from '@/Application/DTOs';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PostgresContext);
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    findOne(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    findByTenant(tenant_id: string): Promise<User[]>;
    purge(id: string): Promise<void>;
    purgeUserRoles(userId: string): Promise<void>;
    purgeByTenant(tenant_id: string): Promise<void>;
}
