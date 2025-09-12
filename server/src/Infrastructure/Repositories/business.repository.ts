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
    updateBusinessDto: BusinessUpdateDto,
  ): Promise<any> {
    const business = await this.prisma.business.update({
      where: { id },
      data: {
        ...(updateBusinessDto.company_name && {
          company_name: updateBusinessDto.company_name,
        }),
        ...(updateBusinessDto.subscription !== undefined && {
          subscription: updateBusinessDto.subscription,
        }),
      },
    });

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
