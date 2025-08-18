import { UserService } from '@/Application/Services/user.service';
import { CreateUserDto } from '@/Application/DTOs/user-create.dto';
import { UpdateUserDto } from '@/Application/DTOs/user-update.dto';
import { UserValidator } from '@/Application/Validators/user.validator';
export declare class UserController {
    private readonly userService;
    private readonly userValidator;
    constructor(userService: UserService, userValidator: UserValidator);
    findAll(page?: number, limit?: number): Promise<{
        users: import("../../Domain/Users/User").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../../Domain/Users/User").User>;
    create(createUserDto: CreateUserDto): Promise<import("../../Domain/Users/User").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../../Domain/Users/User").User>;
    remove(id: string): Promise<void>;
}
