import { CreateUserDto, UpdateUserDto } from '@/Application/DTOs';
export declare class UserValidator {
    private readonly logger;
    validateCreate(createUserDto: CreateUserDto): Promise<void>;
    validateUpdate(updateUserDto: UpdateUserDto): Promise<void>;
    private isValidUUID;
}
