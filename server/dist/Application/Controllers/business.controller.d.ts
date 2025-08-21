import { BusinessService } from '@/Application/Services/business.service';
import { BusinessCreateDto, BusinessUpdateDto, BusinessResponseDto } from '@/Application/DTOs';
import { AuthorizationResponseDto } from '@/Application/DTOs/Authorization/authorization-response.dto';
import { AuthorizationService } from '@/Application/Services/authorization.service';
export declare class BusinessController {
    private readonly businessService;
    private readonly authorizationService;
    private readonly logger;
    constructor(businessService: BusinessService, authorizationService: AuthorizationService);
    findAll(page: number, limit: number, req: any): Promise<{
        businesses: BusinessResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, req: any): Promise<BusinessResponseDto>;
    create(createBusinessDto: BusinessCreateDto): Promise<AuthorizationResponseDto>;
    update(id: string, updateBusinessDto: BusinessUpdateDto, req: any): Promise<BusinessResponseDto>;
    remove(id: string, req: any): Promise<void>;
}
