import { Module } from '@nestjs/common';
import { LeadController } from '@/Application/Controllers/lead.controller';
import { LeadService } from '@/Application/Services/lead.service';
import { DatabaseModule } from '@/Infrastructure/Database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
