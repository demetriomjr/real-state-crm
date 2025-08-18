import { Module } from '@nestjs/common';
import { UserController } from '../Controllers/user.controller';
import { UserService } from '../Services/user.service';
import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { UserValidator } from '../Validators/user.validator';
import { DatabaseModule } from '@/Infrastructure/Database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserValidator],
  exports: [UserService, UserRepository],
})
export class UserModule {}
