import { Module } from "@nestjs/common";
import { BusinessController } from "@/Application/Controllers/business.controller";
import { BusinessService } from "@/Application/Services/business.service";
import { BusinessRepository } from "@/Infrastructure/Repositories/business.repository";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { AuthorizationModule } from "./authorization.module";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [AuthorizationModule, DatabaseModule],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository, UserRepository],
  exports: [BusinessService, BusinessRepository],
})
export class BusinessModule {}
