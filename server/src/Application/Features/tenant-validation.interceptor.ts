import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { UserSecretCacheService } from "@/Application/Services/user-secret-cache.service";

@Injectable()
export class TenantValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TenantValidationInterceptor.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userSecretCache: UserSecretCacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, ip, headers } = request;
    const host = headers.host || "unknown";

    // Skip validation for development environment
    const isDevelopment =
      this.configService.get<string>("NODE_ENV") === "development";
    const isTest = this.configService.get<string>("NODE_ENV") === "test";

    if (isDevelopment || isTest) {
      this.logger.log("Development/Test environment: Skipping tenant validation");
      return next.handle();
    }

    // Skip validation for Docker internal requests
    const isFromDockerInternal =
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "::ffff:127.0.0.1" ||
      ip === "172.18.0.1" ||
      ip === "172.18.0.4" ||
      ip === "172.18.0.5" ||
      ip?.startsWith("172.18.0.") ||
      ip === "172.19.0.1" ||
      ip === "172.20.0.1" ||
      host.includes("localhost"); // Also skip for localhost requests

    if (isFromDockerInternal) {
      this.logger.log(
        `Skipping tenant validation for request from Docker internal: ${ip} (host: ${host})`,
      );
      return next.handle();
    }

    // Skip validation for business creation endpoint
    if (method === "POST" && (path.includes("businesses") || path === "/")) {
      this.logger.log("Skipping tenant validation for business creation endpoint");
      return next.handle();
    }

    // Skip validation for auth endpoints
    if (
      path.includes("auth") ||
      path.includes("login") ||
      path.includes("logout")
    ) {
      this.logger.log("Skipping tenant validation for auth endpoint");
      return next.handle();
    }

    // Skip validation for WhatsApp webhook
    if (method === "POST" && path === "/api/webhooks/whatsapp") {
      this.logger.log("Skipping tenant validation for WhatsApp webhook");
      return next.handle();
    }

    const tenantId = request["tenantId"];
    const userLevel = request["userLevel"];

    // Check if tenant_id and user_level are present (set by JWT guard)
    if (!tenantId || userLevel === undefined) {
      this.logger.warn("Missing tenant_id or user_level in request");
      throw new UnauthorizedException("Missing tenant_id or user_level");
    }

    // Validate userSecret if provided
    const userSecret = headers["x-user-secret"] as string;
    if (userSecret) {
      const userSecretData = this.userSecretCache.getUserBySecret(userSecret);
      if (!userSecretData) {
        this.logger.warn(`Invalid or expired userSecret: ${userSecret}`);
        throw new UnauthorizedException("Invalid or expired userSecret");
      }

      // Verify userSecret matches the JWT payload
      if (
        userSecretData.user_id !== request["userId"] ||
        userSecretData.tenant_id !== tenantId ||
        userSecretData.user_level !== userLevel
      ) {
        this.logger.warn(`UserSecret mismatch for user: ${request["userId"]}`);
        throw new UnauthorizedException("UserSecret validation failed");
      }

      this.logger.log(
        `UserSecret validated for user: ${userSecretData.user_id}`,
      );
    }

    this.logger.log(
      `Tenant validation passed for user: ${request["userId"]}, tenant: ${tenantId}, level: ${userLevel}`,
    );

    return next.handle();
  }
}
