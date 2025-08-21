import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';
import { BusinessService } from '../../src/Application/Services/business.service';
import { TestBusinessManager } from '../helpers/test-business-setup';

export class TestSetup {
  static app: INestApplication;
  static prisma: PrismaService;
  static businessService: BusinessService;
  static server: any;
  static testId: string;

  static async createTestingApp(): Promise<INestApplication> {
    // Generate unique test ID for this test run
    this.testId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Set global prefix to match main application
    app.setGlobalPrefix('api');

    await app.init();
    
    // Start the HTTP server for integration tests
    this.server = await app.listen(0); // Use port 0 to get a random available port
    
    this.app = app;
    this.prisma = app.get<PrismaService>(PrismaService);
    this.businessService = app.get<BusinessService>(BusinessService);
    
    console.log(`🚀 Integration test server running on port ${this.server.address().port} (Test ID: ${this.testId})`);
    
    return app;
  }

  static async cleanupDatabase(): Promise<void> {
    if (this.prisma) {
      // Clean up test data in the correct order (respecting foreign key constraints)
      // Using deleteMany for now, but in production tests should use purge methods from services
      await this.prisma.userRole.deleteMany();
      await this.prisma.user.deleteMany();
      await this.prisma.business.deleteMany();
      
      console.log(`🧹 Database cleaned for test run: ${this.testId}`);
    }
  }

  static async closeApp(): Promise<void> {
    if (this.server) {
      await this.server.close();
    }
    if (this.app) {
      // Purge all created businesses before closing
      if (this.businessService) {
        await TestBusinessManager.purgeAllCreatedBusinesses(this.businessService);
      }
      await this.cleanupDatabase();
      await this.app.close();
    }
  }

  // Helper method to get the server URL for supertest
  static getServerUrl(): string {
    if (!this.server) {
      throw new Error('Test server not started');
    }
    const address = this.server.address();
    return `http://localhost:${address.port}`;
  }

  // Helper method to create JWT token with random UUID for tenant_id
  static createTestJwtToken(username: string = 'testuser', userLevel: number = 10, tenantId?: string): string {
    const jwt = require('jsonwebtoken');
    const { v4: uuidv4 } = require('uuid');
    
    const payload = {
      tenant_id: tenantId || uuidv4(), // Use provided tenant_id or generate random UUID
      user_id: uuidv4(), // Generate random user_id for tests
      user_level: userLevel,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret-key');
  }

  // Helper method to create a business and master user for testing
  static async createTestBusiness(
    businessName: string = 'Test Business',
    masterUsername: string = 'masteruser'
  ) {
    return await TestBusinessManager.createBusinessAndMasterUser(
      this.businessService,
      businessName,
      masterUsername
    );
  }
}
