import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
export declare class PostgresContext extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    $beforeCreate(params: any): Promise<void>;
    $beforeUpdate(params: any): Promise<void>;
    $beforeDelete(params: any): Promise<void>;
    private getCurrentUserId;
}
export { PostgresContext as PrismaService };
