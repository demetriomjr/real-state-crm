import { BusinessService } from '@/Application/Services/business.service';
import { BusinessCreateDto, BusinessUpdateDto, BusinessResponseDto, BusinessCreateResponseDto } from '@/Application/DTOs';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    findAll(page?: number, limit?: number): Promise<{
        businesses: BusinessResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BusinessResponseDto>;
    create(createBusinessDto: BusinessCreateDto): Promise<BusinessCreateResponseDto>;
    update(id: string, updateBusinessDto: BusinessUpdateDto): Promise<BusinessResponseDto>;
    remove(id: string): Promise<void>;
}
