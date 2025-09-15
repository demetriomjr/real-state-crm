import {
  Injectable,
  NotFoundException,
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
  UserResponseDto,
} from "@/Application/DTOs";
import { UserService } from "./user.service";
import { PersonService } from "./person.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UserRepository,
    private readonly businessValidator: BusinessValidator,
    private readonly userService: UserService,
    private readonly personService: PersonService,
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

  async create(createBusinessDto: BusinessCreateDto): Promise<{
    business: BusinessResponseDto;
    masterUserDto: UserResponseDto;
    masterUserLevel: number;
    tenantId: string;
  }> {
    this.logger.log(`Creating new business: ${createBusinessDto.company_name}`);

    // Validate business data
    await this.businessValidator.validateCreate(createBusinessDto);

    // Validate max items for lists
    if (createBusinessDto.contacts && createBusinessDto.contacts.length > 10) {
      throw new BadRequestException("Maximum of 10 contacts allowed");
    }
    if (
      createBusinessDto.documents &&
      createBusinessDto.documents.length > 10
    ) {
      throw new BadRequestException("Maximum of 10 documents allowed");
    }
    if (
      createBusinessDto.addresses &&
      createBusinessDto.addresses.length > 10
    ) {
      throw new BadRequestException("Maximum of 10 addresses allowed");
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

        // Prepare person data
        const personData = {
          full_name: createBusinessDto.master_user_fullName,
          tenant_id: business.id,
        };

        // Prepare sub-entities data
        const subEntitiesData = {
          contacts: [],
        };

        if (createBusinessDto.master_user_email) {
          subEntitiesData.contacts.push({
            contact_type: "email",
            contact_value: createBusinessDto.master_user_email.toLowerCase(),
            is_default: true,
          });
        }

        if (createBusinessDto.master_user_phone) {
          subEntitiesData.contacts.push({
            contact_type: "phone",
            contact_value: createBusinessDto.master_user_phone,
            is_default: true,
          });
        }

        // Create person using PersonService
        const person = await this.personService.createPerson(
          personData,
          subEntitiesData,
        );

        // Create master user with business.id as tenant_id and person.id
        const masterUser = await prisma.user.create({
          data: {
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
            subscription_level: this.getSubscriptionLevel(
              business.subscription,
            ),
          },
          masterUser,
          person,
          contacts: subEntitiesData.contacts,
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

    // Convert masterUser to DTO
    const masterUserDto = await this.userService.findOne(result.masterUser.id);

    return {
      business: this.mapToResponseDto(result.business),
      masterUserDto: masterUserDto,
      masterUserLevel: result.masterUser.user_level,
      tenantId: result.masterUser.tenant_id,
    };
  }

  async update(
    id: string,
    updateBusinessDto: BusinessUpdateDto,
  ): Promise<BusinessResponseDto> {
    this.logger.log(`Updating business with ID: ${id}`);

    // Validate business data
    await this.businessValidator.validateUpdate(updateBusinessDto);

    // Validate max items for lists
    if (updateBusinessDto.contacts && updateBusinessDto.contacts.length > 10) {
      throw new BadRequestException("Maximum of 10 contacts allowed");
    }
    if (
      updateBusinessDto.documents &&
      updateBusinessDto.documents.length > 10
    ) {
      throw new BadRequestException("Maximum of 10 documents allowed");
    }
    if (
      updateBusinessDto.addresses &&
      updateBusinessDto.addresses.length > 10
    ) {
      throw new BadRequestException("Maximum of 10 addresses allowed");
    }

    // Check if business exists
    const existingBusiness = await this.businessRepository.findOne(id);
    if (!existingBusiness) {
      this.logger.warn(`Business with ID ${id} not found for update`);
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    // Separate business data from person data and sub-entities
    const {
      company_name,
      subscription,
      full_name,
      contacts,
      documents,
      addresses,
    } = updateBusinessDto;

    const businessData = {
      company_name,
      subscription,
    };

    // Update business data first
    const business = await this.businessRepository.update(id, businessData);

    // Update person data if provided
    if (full_name || contacts || documents || addresses) {
      // Find the master user (level 9) or fallback to first user
      const masterUser = business.users?.find((user: any) => user.user_level === 9) || business.users?.[0];

      if (masterUser && masterUser.person_id) {
        const personData = {
          full_name,
        };

        const subEntitiesData = {
          contacts,
          documents,
          addresses,
        };

        await this.personService.updatePerson(
          masterUser.person_id,
          personData,
          subEntitiesData,
        );
      }
    }
    this.logger.log(`Business updated successfully with ID: ${business.id}`);

    // Fetch the updated business with relations to return complete data
    const updatedBusiness =
      await this.businessRepository.findOneWithRelations(id);
    return this.mapToResponseDtoWithRelations(updatedBusiness);
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
    const masterUser =
      business.users?.find((user: any) => user.user_level === 9) ||
      business.users?.[0];
    const masterPerson = masterUser?.person;

    // Map addresses to clean DTO format (exclude audit fields and foreign IDs)
    const addresses =
      masterPerson?.addresses?.map((addr: any) => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postal_code: addr.postal_code,
        country: addr.country,
        is_default: addr.is_default,
      })) || [];

    // Map contacts to clean DTO format (exclude audit fields and foreign IDs)
    const contacts =
      masterPerson?.contacts?.map((contact: any) => ({
        id: contact.id,
        contact_type: contact.contact_type,
        contact_value: contact.contact_value,
        is_default: contact.is_default,
      })) || [];

    // Map documents to clean DTO format (exclude audit fields and foreign IDs)
    const documents =
      masterPerson?.documents?.map((doc: any) => ({
        id: doc.id,
        document_type: doc.document_type,
        document_number: doc.document_number,
        is_default: doc.is_default,
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
