import { Contact, Person } from "@prisma/client";
import { PostgresContext } from "@/Infrastructure/Database/postgres.context";
export declare class ContactRepository {
    private readonly context;
    constructor(context: PostgresContext);
    findByPhone(phone: string): Promise<(Contact & {
        person: Person;
    }) | null>;
}
