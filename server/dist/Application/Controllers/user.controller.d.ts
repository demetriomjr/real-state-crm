import { UserService } from '@/Application/Services/user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/Application/DTOs';
import { UserValidator } from '@/Application/Validators/user.validator';
import { AuthorizationService } from '@/Application/Services/authorization.service';
export declare class UserController {
    private readonly userService;
    private readonly userValidator;
    private readonly authorizationService;
    private readonly logger;
    constructor(userService: UserService, userValidator: UserValidator, authorizationService: AuthorizationService);
    findAll(page: number, limit: number, req: any): Promise<UserResponseDto[]>;
    findOne(id: string, req: any): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<UserResponseDto>;
    remove(id: string, req: any): Promise<void>;
}
