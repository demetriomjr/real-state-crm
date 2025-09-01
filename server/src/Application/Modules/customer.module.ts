import { Module } from "@nestjs/common";
import { CustomerController } from "@/Application/Controllers/customer.controller";
import { CustomerService } from "@/Application/Services/customer.service";
import { DatabaseModule } from "@/Infrastructure/Database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
