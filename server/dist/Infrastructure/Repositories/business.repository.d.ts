import { PostgresContext } from '@/Infrastructure/Database/postgres.context';
import { Business } from '@/Domain/Business/Business';
import { BusinessCreateDto, BusinessUpdateDto } from '@/Application/DTOs';
export declare class BusinessRepository {
    private readonly prisma;
    constructor(prisma: PostgresContext);
    findAll(page?: number, limit?: number): Promise<{
        businesses: Business[];
        total: number;
    }>;
    findOne(id: string): Promise<Business | null>;
    findByTenantId(tenant_id: string): Promise<Business | null>;
    create(businessData: BusinessCreateDto): Promise<Business>;
    update(id: string, updateBusinessDto: BusinessUpdateDto): Promise<Business>;
    remove(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    existsByTenantId(tenant_id: string): Promise<boolean>;
}
