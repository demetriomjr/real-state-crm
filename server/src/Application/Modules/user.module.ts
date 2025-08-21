import { Module, forwardRef } from '@nestjs/common';
import { UserController } from '../Controllers/user.controller';
import { UserService } from '../Services/user.service';
import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { UserValidator } from '../Validators/user.validator';
import { DatabaseModule } from '@/Infrastructure/Database/database.module';
import { AuthorizationModule } from './authorization.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthorizationModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserValidator],
  exports: [UserService, UserRepository],
})
export class UserModule {}
