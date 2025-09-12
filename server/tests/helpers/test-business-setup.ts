import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';
import { BusinessService } from '../../src/Application/Services/business.service';
import { BusinessCreateDto } from '../../src/Application/DTOs';
import { AuthorizationResponseDto } from '../../src/Application/DTOs/Authorization/authorization-response.dto';

export interface TestBusinessSetup {
  businessId: string;
  masterUserId: string;
  masterUserToken: string;
  businessName: string;
  masterUsername: string;
}

export class TestBusinessManager {
  private static createdBusinesses: TestBusinessSetup[] = [];

  /**
   * Creates a business and master user for testing
   * @param businessName - Name for the test business
   * @param masterUsername - Username for the master user
   * @returns TestBusinessSetup with business and master user details
   */
  static async createBusinessAndMasterUser(
    businessService: BusinessService,
    businessName: string = 'Test Business',
    masterUsername: string = 'masteruser'
  ): Promise<TestBusinessSetup> {
    const businessData: BusinessCreateDto = {
      company_name: businessName,
      subscription: 1,
      master_user_fullName: 'Master User',
      master_user_username: masterUsername,
      master_user_password: 'masterpass123',
    };

    const result: AuthorizationResponseDto = await businessService.create(businessData);

    // For testing purposes, we need to extract the business ID from the JWT token
    // This is a workaround since the business service no longer returns business details
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(result.token);
    const businessId = decoded?.tenant_id || 'unknown';

    const setup: TestBusinessSetup = {
      businessId: businessId,
      masterUserId: 'unknown', // We can't get this from the token
      masterUserToken: result.token,
      businessName: businessName,
      masterUsername: masterUsername,
    };

    this.createdBusinesses.push(setup);
    return setup;
  }

  /**
   * Purges all created businesses and their associated data
   * This should be called after all tests are complete
   */
  static async purgeAllCreatedBusinesses(businessService: BusinessService): Promise<void> {
    for (const setup of this.createdBusinesses) {
      try {
        await businessService.purge(setup.businessId);
        console.log(`🧹 Purged test business: ${setup.businessName}`);
      } catch (error) {
        console.error(`❌ Failed to purge test business ${setup.businessName}:`, error);
      }
    }
    this.createdBusinesses = [];
  }

  /**
   * Gets the count of created businesses
   */
  static getCreatedBusinessCount(): number {
    return this.createdBusinesses.length;
  }

  /**
   * Resets the manager state (useful for test isolation)
   */
  static reset(): void {
    this.createdBusinesses = [];
  }
}
