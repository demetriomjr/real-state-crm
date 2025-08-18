import { Module } from '@nestjs/common';
import { PostgresContext } from '@/Infrastructure/Database/postgres.context';

@Module({
  providers: [PostgresContext],
  exports: [PostgresContext],
})
export class DatabaseModule {}
