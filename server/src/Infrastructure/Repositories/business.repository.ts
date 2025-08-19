import { Injectable } from '@nestjs/common';
import { PostgresContext } from '@/Infrastructure/Database/postgres.context';
import { Business } from '@/Domain/Business/Business';
import { BusinessCreateDto, BusinessUpdateDto } from '@/Application/DTOs';

@Injectable()
export class BusinessRepository {
  constructor(private readonly prisma: PostgresContext) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ businesses: Business[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.business.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      businesses: businesses.map(business => new Business(business)),
      total,
    };
  }

  async findOne(id: string): Promise<Business | null> {
    const business = await this.prisma.business.findFirst({
      where: { 
        id,
        deleted_at: null 
      },
    });

    return business ? new Business(business) : null;
  }

  async findByTenantId(tenant_id: string): Promise<Business | null> {
    const business = await this.prisma.business.findFirst({
      where: { 
        tenant_id,
        deleted_at: null 
      },
    });

    return business ? new Business(business) : null;
  }

  async create(businessData: BusinessCreateDto): Promise<Business> {
    const business = await this.prisma.business.create({
      data: {
        company_name: businessData.company_name,
        subscription: businessData.subscription || 1,
        tenant_id: businessData.company_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), // Generate tenant_id
      },
    });

    return new Business(business);
  }

  async update(id: string, updateBusinessDto: BusinessUpdateDto): Promise<Business> {
    const business = await this.prisma.business.update({
      where: { id },
      data: {
        ...(updateBusinessDto.company_name && { company_name: updateBusinessDto.company_name }),
        ...(updateBusinessDto.subscription !== undefined && { subscription: updateBusinessDto.subscription }),
      },
    });

    return new Business(business);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.business.update({
      where: { id },
      data: { 
        deleted_at: new Date(),
        deleted_by: 'system', // This should come from auth context
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.business.count({
      where: { 
        id,
        deleted_at: null 
      },
    });
    return count > 0;
  }

  async existsByTenantId(tenant_id: string): Promise<boolean> {
    const count = await this.prisma.business.count({
      where: { 
        tenant_id,
        deleted_at: null 
      },
    });
    return count > 0;
  }
}
