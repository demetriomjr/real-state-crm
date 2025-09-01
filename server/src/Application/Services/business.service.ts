import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { BusinessRepository } from "@/Infrastructure/Repositories/business.repository";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { Business } from "@/Domain/Business/Business";
import {
  BusinessCreateDto,
  BusinessUpdateDto,
  BusinessResponseDto,
} from "@/Application/DTOs";
import { AuthorizationResponseDto } from "@/Application/DTOs/Authorization/authorization-response.dto";
import { AuthorizationService } from "./authorization.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UserRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  private get prisma() {
    return this.businessRepository["prisma"];
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    userLevel?: number,
  ): Promise<{
    businesses: BusinessResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(
      `Fetching businesses with pagination: page=${page}, limit=${limit}`,
    );

    // Check if user has developer access (level 10)
    if (userLevel !== undefined && userLevel < 10) {
      this.logger.warn(
        `User with level ${userLevel} attempted to access findAll - access denied`,
      );
      throw new BadRequestException(
        "Access denied. Developer level (10) required to view all businesses.",
      );
    }

    const result = await this.businessRepository.findAll(page, limit);
    return {
      businesses: result.businesses.map((business) =>
        this.mapToResponseDto(business),
      ),
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

  async create(
    createBusinessDto: BusinessCreateDto,
  ): Promise<AuthorizationResponseDto> {
    this.logger.log(`Creating new business: ${createBusinessDto.company_name}`);

    // Check if master user username already exists
    const existingUser = await this.userRepository.findByUsername(
      createBusinessDto.master_user_username,
    );
    if (existingUser) {
      this.logger.warn(
        `Master user username already exists: ${createBusinessDto.master_user_username}`,
      );
      throw new ConflictException("Master user username already exists");
    }

    // Start transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      try {
        // Create business first
        const business = await prisma.business.create({
          data: {
            company_name: createBusinessDto.company_name,
            subscription: createBusinessDto.subscription || 1,
          },
        });

        // Hash the master user password
        const hashedPassword = await bcrypt.hash(
          createBusinessDto.master_user_password,
          10,
        );

        // Create master user with business.id as tenant_id
        const masterUser = await prisma.user.create({
          data: {
            fullName: createBusinessDto.master_user_fullName,
            username: createBusinessDto.master_user_username,
            password: hashedPassword,
            user_level: 9, // Master user level
            tenant_id: business.id, // Use business.id as tenant_id
          },
        });

        return { business: new Business(business), masterUser };
      } catch (error) {
        this.logger.error(`Transaction failed: ${error.message}`);
        throw new BadRequestException(
          "Failed to create business and master user",
        );
      }
    });

    // Create JWT token for the master user
    const authToken = await this.authorizationService.createToken(
      result.masterUser,
    );

    this.logger.log(
      `Business created successfully: ${result.business.company_name} with master user: ${result.masterUser.username}`,
    );

    return authToken;
  }

  async update(
    id: string,
    updateBusinessDto: BusinessUpdateDto,
  ): Promise<BusinessResponseDto> {
    this.logger.log(`Updating business with ID: ${id}`);

    // Check if business exists
    const existingBusiness = await this.businessRepository.findOne(id);
    if (!existingBusiness) {
      this.logger.warn(`Business with ID ${id} not found for update`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    const business = await this.businessRepository.update(
      id,
      updateBusinessDto,
    );
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

  async validateTenantId(tenantId: string): Promise<boolean> {
    this.logger.log(`Validating tenant ID: ${tenantId}`);
    return await this.businessRepository.validateTenantId(tenantId);
  }

  /**
   * PURGE - Permanently delete business and all related entities
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   * NOT EXPOSED TO CONTROLLERS - Service level only
   */
  async purge(id: string): Promise<void> {
    this.logger.warn(`PURGING business with ID: ${id} - PERMANENT DELETION`);

    // Check if business exists
    const existingBusiness = await this.businessRepository.findOne(id);
    if (!existingBusiness) {
      this.logger.warn(`Business with ID ${id} not found for purge`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    // Use business.id as tenant_id
    const tenantId = existingBusiness.id;

    // Start transaction to ensure all related data is purged atomically
    await this.prisma.$transaction(async (prisma) => {
      // 1. Purge all user roles for users in this tenant
      const users = await this.userRepository.findByTenant(tenantId);
      for (const user of users) {
        await this.userRepository.purgeUserRoles(user.id);
      }

      // 2. Purge all users in this tenant
      await this.userRepository.purgeByTenant(tenantId);

      // 3. Finally purge the business itself
      await this.businessRepository.purge(id);
    });

    this.logger.warn(
      `Business PURGED permanently with ID: ${id} and tenant: ${tenantId}`,
    );
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
