import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "../Controllers/user.controller";
import { UserService } from "../Services/user.service";
import { PasswordService } from "../Services/password.service";
import { UserLoginLogService } from "../Services/user-login-log.service";
import { PersonService } from "../Services/person.service";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { UserLoginLogRepository } from "@/Infrastructure/Repositories/user-login-log.repository";
import { UserValidator } from "../Validators/user.validator";
import { PersonValidator } from "../Validators/person.validator";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";
import { AuthorizationModule } from "./authorization.module";

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthorizationModule)],
  controllers: [UserController],
  providers: [
    UserService,
    PasswordService,
    UserLoginLogService,
    PersonService,
    UserRepository,
    UserLoginLogRepository,
    UserValidator,
    PersonValidator,
  ],
  exports: [
    UserService,
    PasswordService,
    UserLoginLogService,
    UserRepository,
    UserLoginLogRepository,
  ],
})
export class UserModule {}
