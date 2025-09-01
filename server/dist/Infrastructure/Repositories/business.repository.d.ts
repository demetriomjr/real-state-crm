import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Business } from "@/Domain/Business/Business";
import { BusinessCreateDto, BusinessUpdateDto } from "@/Application/DTOs";
export declare class BusinessRepository {
    private readonly prisma;
    constructor(prisma: MainDatabaseContext);
    findAll(page?: number, limit?: number): Promise<{
        businesses: Business[];
        total: number;
    }>;
    findOne(id: string): Promise<Business | null>;
    create(businessData: BusinessCreateDto): Promise<Business>;
    update(id: string, updateBusinessDto: BusinessUpdateDto): Promise<Business>;
    remove(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    validateTenantId(tenantId: string): Promise<boolean>;
    purge(id: string): Promise<void>;
}
