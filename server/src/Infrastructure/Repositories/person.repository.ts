import { Injectable } from "@nestjs/common";
import { Prisma, Person } from "@prisma/client";
import { PostgresContext } from "@/Infrastructure/Database/postgres.context";

@Injectable()
export class PersonRepository {
  constructor(private readonly context: PostgresContext) {}

  async create(data: Prisma.PersonCreateInput): Promise<Person> {
    return this.context.person.create({ data });
  }

  async findById(id: string): Promise<Person | null> {
    return this.context.person.findUnique({ where: { id } });
  }
}
