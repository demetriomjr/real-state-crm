import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { BusinessRepository } from "@/Infrastructure/Repositories/business.repository";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import { BusinessValidator } from "@/Application/Validators/business.validator";
import {
  BusinessCreateDto,
  BusinessUpdateDto,
  BusinessResponseDto,
} from "@/Application/DTOs";
import * as bcrypt from "bcryptjs";

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UserRepository,
    private readonly businessValidator: BusinessValidator,
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
    totalPages: number;
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
      totalPages: Math.ceil(result.total / limit),
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
  ): Promise<{ business: BusinessResponseDto; masterUser: any }> {
    this.logger.log(`Creating new business: ${createBusinessDto.company_name}`);

    // Validate business data
    await this.businessValidator.validateCreate(createBusinessDto);

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

        // Create person for the master user
        const person = await prisma.person.create({
          data: {
            full_name: createBusinessDto.master_user_fullName,
            tenant_id: business.id,
          },
        });

        // Create contacts for the person (email and phone) - only if provided
        const contacts = [];

        if (createBusinessDto.master_user_email) {
          contacts.push(
            prisma.contact.create({
              data: {
                contact_type: "email",
                contact_value:
                  createBusinessDto.master_user_email.toLowerCase(),
                person_id: person.id,
                is_primary: true,
                is_default: true,
              },
            }),
          );
        }

        if (createBusinessDto.master_user_phone) {
          contacts.push(
            prisma.contact.create({
              data: {
                contact_type: "phone",
                contact_value: createBusinessDto.master_user_phone,
                person_id: person.id,
                is_primary: true,
                is_default: true,
              },
            }),
          );
        }

        if (contacts.length > 0) {
          await Promise.all(contacts);
        }

        // Create master user with business.id as tenant_id and person.id
        const masterUser = await prisma.user.create({
          data: {
            fullName: createBusinessDto.master_user_fullName,
            username: createBusinessDto.master_user_username.toLowerCase(),
            password: hashedPassword,
            user_level: 9, // Master user level
            tenant_id: business.id, // Use business.id as tenant_id
            person_id: person.id, // Link to person
          },
        });

        return {
          business: {
            ...business,
            subscription_level: this.getSubscriptionLevel(business.subscription),
          },
          masterUser,
          person,
          contacts,
        };
      } catch (error) {
        this.logger.error(`Transaction failed: ${error.message}`);
        throw new BadRequestException(
          "Failed to create business and master user",
        );
      }
    });

    this.logger.log(
      `Business created successfully: ${result.business.company_name} with master user: ${result.masterUser.username}`,
    );

    return {
      business: this.mapToResponseDto(result.business),
      masterUser: result.masterUser,
    };
  }

  async update(
    id: string,
    updateBusinessDto: BusinessUpdateDto,
  ): Promise<BusinessResponseDto> {
    this.logger.log(`Updating business with ID: ${id}`);

    // Validate business data
    await this.businessValidator.validateUpdate(updateBusinessDto);

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

  async findOneWithRelations(id: string): Promise<BusinessResponseDto> {
    this.logger.log(`Fetching business with relations for ID: ${id}`);

    const business = await this.businessRepository.findOneWithRelations(id);
    if (!business) {
      this.logger.warn(`Business with ID ${id} not found`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    return this.mapToResponseDtoWithRelations(business);
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
    await this.prisma.$transaction(async () => {
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

  private getSubscriptionLevel(subscription: number): string {
    if (subscription >= 10) return "premium";
    if (subscription >= 5) return "standard";
    return "basic";
  }

  private mapToResponseDto(business: any): BusinessResponseDto {
    return {
      id: business.id,
      company_name: business.company_name,
      subscription_level: this.getSubscriptionLevel(business.subscription),
      created_at: business.created_at,
      // Flattened Person data
      full_name: business.full_name,
      // Person-related data as Business properties (addresses, contacts, documents)
      addresses: [],
      contacts: [],
      documents: [],
    };
  }

  private mapToResponseDtoWithRelations(business: any): BusinessResponseDto {
    // Find the master user (level 9) or fallback to first user
    const masterUser = business.users?.find((user: any) => user.user_level === 9) || business.users?.[0];
    const masterPerson = masterUser?.person;

    // Map addresses to clean DTO format (exclude audit fields and foreign IDs)
    const addresses = masterPerson?.addresses?.map((addr: any) => ({
      id: addr.id,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      is_primary: addr.is_primary,
      is_default: addr.is_default
    })) || [];

    // Map contacts to clean DTO format (exclude audit fields and foreign IDs)
    const contacts = masterPerson?.contacts?.map((contact: any) => ({
      id: contact.id,
      contact_type: contact.contact_type,
      contact_value: contact.contact_value,
      is_primary: contact.is_primary,
      is_default: contact.is_default
    })) || [];

    // Map documents to clean DTO format (exclude audit fields and foreign IDs)
    const documents = masterPerson?.documents?.map((doc: any) => ({
      id: doc.id,
      document_type: doc.document_type,
      document_number: doc.document_number,
      is_primary: doc.is_primary,
      is_default: doc.is_default
    })) || [];

    return {
      id: business.id,
      company_name: business.company_name,
      subscription_level: this.getSubscriptionLevel(business.subscription),
      created_at: business.created_at,
      // Flattened Person data (without audit fields or foreign IDs)
      full_name: masterPerson?.full_name,
      // Person-related data as Business properties (addresses, contacts, documents)
      addresses,
      contacts,
      documents,
    };
  }
}
