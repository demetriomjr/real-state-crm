import { Module } from "@nestjs/common";
import { PostgresContext } from "./postgres.context";
import { MainDatabaseContext } from "./main-database.context";

@Module({
  providers: [PostgresContext, MainDatabaseContext],
  exports: [PostgresContext, MainDatabaseContext],
})
export class DatabaseModule {}
