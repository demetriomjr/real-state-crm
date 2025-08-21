import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostgresContext extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/real_state_crm',
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected');
  }

  // Audit middleware for automatic timestamp and user tracking
  async $beforeCreate(params: any) {
    const now = new Date();
    const userId = this.getCurrentUserId(); // You'll need to implement this based on your auth system
    
    if (params.data) {
      params.data.created_at = now;
      params.data.updated_at = now;
      params.data.created_by = userId;
      params.data.updated_by = userId;
    }
  }

  async $beforeUpdate(params: any) {
    const now = new Date();
    const userId = this.getCurrentUserId();
    
    if (params.data) {
      params.data.updated_at = now;
      params.data.updated_by = userId;
    }
  }

  async $beforeDelete(params: any) {
    const now = new Date();
    const userId = this.getCurrentUserId();
    
    // Soft delete implementation
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = {
        deleted_at: now,
        deleted_by: userId,
      };
    }
  }

  private getCurrentUserId(): string {
    // This should be implemented based on your authentication system
    // For now, returning a default value
    return 'system';
  }
}

// Export alias for backward compatibility with tests
export { PostgresContext as PrismaService };
