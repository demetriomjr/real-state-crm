import { CreateUserDto } from '../DTOs/user-create.dto';
import { UpdateUserDto } from '../DTOs/user-update.dto';
export declare class UserValidator {
    validateCreate(createUserDto: CreateUserDto): Promise<void>;
    validateUpdate(updateUserDto: UpdateUserDto): Promise<void>;
    private isValidUUID;
}
