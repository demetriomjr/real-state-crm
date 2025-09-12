import { Injectable } from "@nestjs/common";
import { Prisma, Lead } from "@prisma/client";
import { PostgresContext } from "@/Infrastructure/Database/postgres.context";

@Injectable()
export class LeadRepository {
  constructor(private readonly context: PostgresContext) {}

  async create(data: Prisma.LeadCreateInput): Promise<Lead> {
    return this.context.lead.create({ data });
  }
}
