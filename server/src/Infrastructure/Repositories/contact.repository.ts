import { Injectable } from "@nestjs/common";
import { Prisma, Contact, Person } from "@prisma/client";
import { PostgresContext } from "@/Infrastructure/Database/postgres.context";

@Injectable()
export class ContactRepository {
  constructor(private readonly context: PostgresContext) {}

  async findByPhone(
    phone: string,
  ): Promise<(Contact & { person: Person }) | null> {
    return this.context.contact.findFirst({
      where: {
        contact_value: phone,
      },
      include: {
        person: true,
      },
    });
  }
}
