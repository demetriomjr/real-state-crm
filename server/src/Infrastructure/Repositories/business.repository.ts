import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { BusinessCreateDto, BusinessUpdateDto } from "@/Application/DTOs";

@Injectable()
export class BusinessRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  private getSubscriptionLevel(subscription: number): string {
    if (subscription >= 10) return "premium";
    if (subscription >= 5) return "standard";
    return "basic";
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ businesses: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.business.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      businesses: businesses.map((business) => ({
        ...business,
        subscription_level: this.getSubscriptionLevel(business.subscription),
      })),
      total,
    };
  }

  async findOne(id: string): Promise<any | null> {
    const business = await this.prisma.business.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    return business;
  }

  async findOneWithRelations(id: string): Promise<any | null> {
    const business = await this.prisma.business.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        users: {
          where: { deleted_at: null },
          include: {
            person: {
              include: {
                contacts: {
                  where: { deleted_at: null },
                },
                documents: {
                  where: { deleted_at: null },
                },
                addresses: {
                  where: { deleted_at: null },
                },
              },
            },
          },
        },
      },
    });

    if (!business) {
      return null;
    }

    // Return the raw business entity with relations - Service layer will handle DTO mapping
    return business;
  }

  async create(businessData: BusinessCreateDto): Promise<any> {
    const business = await this.prisma.business.create({
      data: {
        company_name: businessData.company_name,
        subscription: businessData.subscription || 1,
      },
    });

    // Return the raw business entity - Service layer will handle DTO mapping
    return business;
  }

  async update(
    id: string,
    businessData: any,
    personData?: any,
    subEntitiesData?: any,
  ): Promise<any> {
    // Update business data
    const business = await this.prisma.business.update({
      where: { id },
      data: {
        ...(businessData.company_name && {
          company_name: businessData.company_name,
        }),
        ...(businessData.subscription !== undefined && {
          subscription: businessData.subscription,
        }),
      },
      include: {
        users: {
          include: {
            person: true,
          },
        },
      },
    });

    // Update person data if provided
    if (personData && personData.full_name) {
      // Find the master user (level 9) or fallback to first user
      const masterUser =
        business.users?.find((user: any) => user.user_level === 9) ||
        business.users?.[0];

      if (masterUser && masterUser.person_id) {
        await this.prisma.person.update({
          where: { id: masterUser.person_id },
          data: {
            full_name: personData.full_name,
          },
        });
      }
    }

    // Update sub-entities if provided
    if (subEntitiesData) {
      const masterUser =
        business.users?.find((user: any) => user.user_level === 9) ||
        business.users?.[0];

      if (masterUser && masterUser.person_id) {
        const personId = masterUser.person_id;

        // Handle contacts
        if (subEntitiesData.contacts && subEntitiesData.contacts.length > 0) {
          // Delete existing contacts for this person
          await this.prisma.contact.deleteMany({
            where: { person_id: personId },
          });

          // Create new contacts
          for (const contact of subEntitiesData.contacts) {
            await this.prisma.contact.create({
              data: {
                contact_type: contact.contact_type,
                contact_value: contact.contact_value,
                person_id: personId,
                is_default: contact.is_default,
              },
            });
          }
        }

        // Handle documents
        if (subEntitiesData.documents && subEntitiesData.documents.length > 0) {
          // Delete existing documents for this person
          await this.prisma.document.deleteMany({
            where: { person_id: personId },
          });

          // Create new documents
          for (const document of subEntitiesData.documents) {
            await this.prisma.document.create({
              data: {
                document_type: document.document_type,
                document_number: document.document_number,
                person_id: personId,
                is_default: document.is_default,
              },
            });
          }
        }

        // Handle addresses
        if (subEntitiesData.addresses && subEntitiesData.addresses.length > 0) {
          // Delete existing addresses for this person
          await this.prisma.address.deleteMany({
            where: { person_id: personId },
          });

          // Create new addresses
          for (const address of subEntitiesData.addresses) {
            await this.prisma.address.create({
              data: {
                street: address.street,
                city: address.city,
                state: address.state,
                postal_code: address.postal_code,
                country: address.country,
                person_id: personId,
                is_default: address.is_default,
              },
            });
          }
        }
      }
    }

    // Return the raw business entity - Service layer will handle DTO mapping
    return business;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.business.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: "system", // This should come from auth context
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.business.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  async validateTenantId(tenantId: string): Promise<boolean> {
    const count = await this.prisma.business.count({
      where: {
        id: tenantId,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  /**
   * PURGE - Permanently delete business from database
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purge(id: string): Promise<void> {
    await this.prisma.business.delete({
      where: { id },
    });
  }
}
