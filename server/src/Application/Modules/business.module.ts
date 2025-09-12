import { Module, forwardRef } from "@nestjs/common";
import { BusinessController } from "@/Application/Controllers/business.controller";
import { BusinessService } from "@/Application/Services/business.service";
import { BusinessRepository } from "@/Infrastructure/Repositories/business.repository";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { BusinessValidator } from "@/Application/Validators/business.validator";
import { AuthorizationModule } from "./authorization.module";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [forwardRef(() => AuthorizationModule), DatabaseModule],
  controllers: [BusinessController],
  providers: [
    BusinessService,
    BusinessRepository,
    UserRepository,
    BusinessValidator,
  ],
  exports: [BusinessService, BusinessRepository],
})
export class BusinessModule {}
