import { Prisma, Person } from "@prisma/client";
import { PostgresContext } from "@/Infrastructure/Database/postgres.context";
export declare class PersonRepository {
    private readonly context;
    constructor(context: PostgresContext);
    create(data: Prisma.PersonCreateInput): Promise<Person>;
    findById(id: string): Promise<Person | null>;
}
