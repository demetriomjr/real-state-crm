import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { BusinessRepository } from '@/Infrastructure/Repositories/business.repository';
import { UserRepository } from '@/Infrastructure/Repositories/user.repository';
import { Business } from '@/Domain/Business/Business';
import { BusinessCreateDto, BusinessUpdateDto, BusinessResponseDto, BusinessCreateResponseDto } from '@/Application/DTOs';
import { AuthorizationService } from './authorization.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UserRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  private get prisma() {
    return this.businessRepository['prisma'];
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ businesses: BusinessResponseDto[]; total: number; page: number; limit: number }> {
    this.logger.log(`Fetching businesses with pagination: page=${page}, limit=${limit}`);
    const result = await this.businessRepository.findAll(page, limit);
    return {
      businesses: result.businesses.map(business => this.mapToResponseDto(business)),
      total: result.total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<BusinessResponseDto> {
    this.logger.log(`Fetching business with ID: ${id}`);
    const business = await this.businessRepository.findOne(id);
    if (!business) {
      this.logger.warn(`Business with ID ${id} not found`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return this.mapToResponseDto(business);
  }

  async create(createBusinessDto: BusinessCreateDto): Promise<BusinessCreateResponseDto> {
    this.logger.log(`Creating new business: ${createBusinessDto.company_name}`);
    
    // Check if master user username already exists
    const existingUser = await this.userRepository.findByUsername(createBusinessDto.master_user_username);
    if (existingUser) {
      this.logger.warn(`Master user username already exists: ${createBusinessDto.master_user_username}`);
      throw new ConflictException('Master user username already exists');
    }

    // Start transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      try {
        // Create business
        const businessData = {
          company_name: createBusinessDto.company_name,
          subscription: createBusinessDto.subscription || 1,
        };
        
        const business = await prisma.business.create({
          data: {
            ...businessData,
            tenant_id: createBusinessDto.company_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
          },
        });

        // Hash the master user password
        const hashedPassword = await bcrypt.hash(createBusinessDto.master_user_password, 10);

        // Create master user
        const masterUser = await prisma.user.create({
          data: {
            fullName: createBusinessDto.master_user_fullName,
            username: createBusinessDto.master_user_username,
            password: hashedPassword,
            user_level: 9, // Master user level
            tenant_id: business.tenant_id,
          },
        });

        return { business: new Business(business), masterUser };
      } catch (error) {
        this.logger.error(`Transaction failed: ${error.message}`);
        throw new BadRequestException('Failed to create business and master user');
      }
    });

    // Create JWT token for the master user
    const authToken = await this.authorizationService.createToken(result.masterUser);

    this.logger.log(`Business created successfully: ${result.business.company_name} with master user: ${result.masterUser.username}`);

    return {
      business: this.mapToResponseDto(result.business),
      master_user: {
        id: result.masterUser.id,
        fullName: result.masterUser.fullName,
        username: result.masterUser.username,
        user_level: result.masterUser.user_level,
      },
      auth: authToken,
      message: 'Business and master user created successfully',
    };
  }

  async update(id: string, updateBusinessDto: BusinessUpdateDto): Promise<BusinessResponseDto> {
    this.logger.log(`Updating business with ID: ${id}`);
    
    // Check if business exists
    const existingBusiness = await this.businessRepository.findOne(id);
    if (!existingBusiness) {
      this.logger.warn(`Business with ID ${id} not found for update`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    const business = await this.businessRepository.update(id, updateBusinessDto);
    this.logger.log(`Business updated successfully with ID: ${business.id}`);
    return this.mapToResponseDto(business);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing business with ID: ${id}`);
    
    // Check if business exists
    const existingBusiness = await this.businessRepository.findOne(id);
    if (!existingBusiness) {
      this.logger.warn(`Business with ID ${id} not found for removal`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    await this.businessRepository.remove(id);
    this.logger.log(`Business removed successfully with ID: ${id}`);
  }

  private mapToResponseDto(business: Business): BusinessResponseDto {
    return {
      company_name: business.company_name,
      subscription: business.subscription,
      subscription_level: business.getSubscriptionLevel(),
      created_at: business.created_at,
      created_by: business.created_by,
      updated_at: business.updated_at,
      updated_by: business.updated_by,
      deleted_at: business.deleted_at,
      deleted_by: business.deleted_by,
    };
  }
}
