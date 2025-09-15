import { Module, forwardRef } from "@nestjs/common";
import { BusinessController } from "@/Application/Controllers/business.controller";
import { BusinessService } from "@/Application/Services/business.service";
import { BusinessRepository } from "@/Infrastructure/Repositories/business.repository";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { BusinessValidator } from "@/Application/Validators/business.validator";
import { PersonService } from "@/Application/Services/person.service";
import { PersonValidator } from "@/Application/Validators/person.validator";
import { AuthorizationModule } from "./authorization.module";
import { UserModule } from "./user.module";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [
    forwardRef(() => AuthorizationModule),
    forwardRef(() => UserModule),
    DatabaseModule,
  ],
  controllers: [BusinessController],
  providers: [
    BusinessService,
    BusinessRepository,
    UserRepository,
    BusinessValidator,
    PersonService,
    PersonValidator,
  ],
  exports: [BusinessService, BusinessRepository],
})
export class BusinessModule {}
