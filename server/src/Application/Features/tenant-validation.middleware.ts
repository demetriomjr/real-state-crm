import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BusinessService } from '@/Application/Services/business.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantValidationMiddleware.name);

  constructor(
    private readonly businessService: BusinessService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req['tenantId'];
    const userLevel = req['userLevel'];
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    const isTest = this.configService.get<string>('NODE_ENV') === 'test';

    // Skip validation for test environment
    if (isTest) {
      this.logger.log('Test environment: Skipping tenant validation');
      return next();
    }

    // Skip validation for endpoints that don't require authentication
    const path = req.path;
    const method = req.method;
    if (method === 'POST' && path === '/api/businesses') {
      this.logger.log('Skipping tenant validation for business creation endpoint');
      return next();
    }

    // Skip validation if no tenant_id or user_level (should be handled by JWT strategy)
    if (!tenantId || userLevel === undefined) {
      this.logger.warn('Missing tenant_id or user_level in request');
      throw new UnauthorizedException('Missing tenant_id or user_level');
    }

    // In development, allow null/empty tenant_id for user_level 10 (admin)
    if (isDevelopment && (!tenantId || tenantId === '00000000-0000-0000-0000-000000000000') && userLevel >= 10) {
      this.logger.log('Development mode: Skipping tenant validation for admin user');
      return next();
    }

    // Validate tenant_id exists in database
    const isValidTenant = await this.businessService.validateTenantId(tenantId);
    if (!isValidTenant) {
      this.logger.warn(`Invalid tenant_id: ${tenantId}`);
      throw new UnauthorizedException('Invalid tenant_id');
    }

    this.logger.log(`Tenant validation passed for tenant_id: ${tenantId}`);
    next();
  }
}
