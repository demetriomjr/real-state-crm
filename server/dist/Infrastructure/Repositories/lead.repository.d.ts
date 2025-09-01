import { Prisma, Lead } from "@prisma/client";
import { PostgresContext } from "@/Infrastructure/Database/postgres.context";
export declare class LeadRepository {
    private readonly context;
    constructor(context: PostgresContext);
    create(data: Prisma.LeadCreateInput): Promise<Lead>;
}
