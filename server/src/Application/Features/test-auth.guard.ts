import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TestAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const nodeEnv = this.configService.get<string>("NODE_ENV");

    console.log(`TestAuthGuard: Checking access for NODE_ENV: ${nodeEnv}`);

    // In test or development environment, always allow access
    if (nodeEnv === "test" || nodeEnv === "development") {
      const request = context.switchToHttp().getRequest();

      // For tenant isolation tests, we need to respect the actual tenant ID from the JWT token
      // Check if there's an Authorization header with a JWT token
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const jwt = require("jsonwebtoken");
          const token = authHeader.substring(7);
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ||
              "your-super-secret-jwt-key-change-in-production",
          );

          // Use the tenant_id from the JWT token for proper tenant isolation
          request.tenantId = decoded.tenant_id;
          request.userId = decoded.user_id;
          request.userLevel = decoded.user_level;
          request.user = decoded;

          // Log additional fields for debugging
          if (decoded.refresh_id) {
            console.log(
              `TestAuthGuard: Token includes refresh_id: ${decoded.refresh_id}`,
            );
          }

          console.log(
            `TestAuthGuard: Using JWT token data - tenantId: ${decoded.tenant_id}, userLevel: ${decoded.user_level}`,
          );
          return true;
        } catch (error) {
          console.log(
            "TestAuthGuard: Invalid JWT token, using default test data",
          );
        }
      }

      // Fallback to default test data (use existing business ID from logs)
      let tenantId = "0f476fcf-c9a5-4a3d-adfe-61cdd4106651";
      const urlParams = request.params;
      if (urlParams && urlParams.id) {
        tenantId = urlParams.id;
      }

      // Set mock user data for test environment
      request.tenantId = tenantId;
      request.userId = "test-user-id";
      request.userLevel = 10; // Developer level
      request.user = {
        tenant_id: tenantId,
        user_id: "test-user-id",
        user_level: 10,
      };

      console.log(
        `TestAuthGuard: Using default test data - tenantId: ${tenantId}`,
      );
      return true;
    }

    console.log(`TestAuthGuard: Denying access in ${nodeEnv} environment`);
    // In non-test/development environments, deny access (this guard should not be used in production)
    return false;
  }
}
