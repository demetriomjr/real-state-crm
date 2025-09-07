import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { BusinessService } from "@/Application/Services/business.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TenantValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantValidationMiddleware.name);

  constructor(
    private readonly businessService: BusinessService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const method = req.method;
    const host = req.get("host");
    const origin = req.get("origin");
    const userAgent = req.get("user-agent");

    // Debug logging to see what we're getting
    this.logger.log(
      `DEBUG: Request from IP: ${req.ip}, Host: ${host}, Origin: ${origin}, UserAgent: ${userAgent}, Path: ${path}`,
    );

    // Skip ALL validation for requests from host.docker.internal (n8n webhooks)
    const isFromDockerInternal = 
      host === "host.docker.internal" || 
      origin?.includes("host.docker.internal") ||
      userAgent?.includes("n8n") ||
      req.ip === "172.17.0.1" || // Docker bridge IP
      req.ip === "172.18.0.1" || // Docker compose network gateway
      req.ip === "172.18.0.4" || // n8n container IP
      req.ip === "172.18.0.5" || // WAHA container IP
      req.ip?.startsWith("172.18.0.") || // Docker compose network range
      req.ip === "172.19.0.1" || // Alternative Docker network IP
      req.ip === "172.20.0.1"; // Alternative Docker network IP

    if (isFromDockerInternal) {
      this.logger.log(
        `Skipping ALL tenant validation for request from Docker internal: ${req.ip} (host: ${host})`,
      );
      return next();
    }

    // Skip validation for n8n inbound webhook (additional safety check)
    if (method === "POST" && path === "/api/webhooks/whatsapp") {
      this.logger.log(
        "Skipping tenant validation for WhatsApp inbound webhook",
      );
      return next();
    }

    const tenantId = req["tenantId"];
    const userLevel = req["userLevel"];
    const isDevelopment =
      this.configService.get<string>("NODE_ENV") === "development";
    const isTest = this.configService.get<string>("NODE_ENV") === "test";

    // Skip validation for test environment
    if (isTest) {
      this.logger.log("Test environment: Skipping tenant validation");
      return next();
    }

    // Skip validation for endpoints that don't require authentication
    if (method === "POST" && path === "/api/businesses") {
      this.logger.log(
        "Skipping tenant validation for business creation endpoint",
      );
      return next();
    }

    // Skip validation if no tenant_id or user_level (should be handled by JWT strategy)
    if (!tenantId || userLevel === undefined) {
      this.logger.warn("Missing tenant_id or user_level in request");
      throw new UnauthorizedException("Missing tenant_id or user_level");
    }

    // In development, allow null/empty tenant_id for user_level 10 (admin)
    if (
      isDevelopment &&
      (!tenantId || tenantId === "00000000-0000-0000-0000-000000000000") &&
      userLevel >= 10
    ) {
      this.logger.log(
        "Development mode: Skipping tenant validation for admin user",
      );
      return next();
    }

    // Validate tenant_id exists in database
    const isValidTenant = await this.businessService.validateTenantId(tenantId);
    if (!isValidTenant) {
      this.logger.warn(`Invalid tenant_id: ${tenantId}`);
      throw new UnauthorizedException("Invalid tenant_id");
    }

    this.logger.log(`Tenant validation passed for tenant_id: ${tenantId}`);
    next();
  }
}
