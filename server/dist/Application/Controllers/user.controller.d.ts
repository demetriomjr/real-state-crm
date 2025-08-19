import { UserService } from '@/Application/Services/user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/Application/DTOs';
import { UserValidator } from '@/Application/Validators/user.validator';
export declare class UserController {
    private readonly userService;
    private readonly userValidator;
    constructor(userService: UserService, userValidator: UserValidator);
    findAll(page: number, limit: number, req: any): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<UserResponseDto>;
    remove(id: string, req: any): Promise<void>;
}
