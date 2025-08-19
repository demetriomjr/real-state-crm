import { BusinessRepository } from '@/Infrastructure/Repositories/business.repository';
import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { BusinessCreateDto, BusinessUpdateDto, BusinessResponseDto, BusinessCreateResponseDto } from '@/Application/DTOs';
import { AuthorizationService } from './authorization.service';
export declare class BusinessService {
    private readonly businessRepository;
    private readonly userRepository;
    private readonly authorizationService;
    private readonly logger;
    constructor(businessRepository: BusinessRepository, userRepository: UserRepository, authorizationService: AuthorizationService);
    private get prisma();
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
    private mapToResponseDto;
}
