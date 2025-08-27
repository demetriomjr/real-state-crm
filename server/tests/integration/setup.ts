import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';
import { BusinessService } from '../../src/Application/Services/business.service';
import { TestBusinessManager } from '../helpers/test-business-setup';
import * as bcrypt from 'bcryptjs';

export class TestSetup {
  static app: INestApplication;
  static prisma: PrismaService;
  static businessService: BusinessService;
  static server: any;
  static testId: string;

  static async createTestingApp(): Promise<INestApplication> {
    // Set NODE_ENV to test for integration tests
    process.env.NODE_ENV = 'test';
    
    // Ensure JWT secret is set for tests
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
    }
    
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
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
    
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

  // Helper method to create a test business and user with proper JWT token
  static async createTestBusinessAndUser(
    businessName: string = 'Test Business',
    username: string = 'testuser',
    userLevel: number = 10
  ) {
    // Create business
    const business = await this.prisma.business.create({
      data: {
        company_name: businessName,
        subscription: 1,
      },
    });

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        fullName: 'Test User',
        password: hashedPassword,
        user_level: userLevel,
        tenant_id: business.id,
      },
    });

    // Create JWT token for this user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({
      tenant_id: business.id,
      user_id: user.id,
      user_level: user.user_level,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');

    return {
      business,
      user,
      token,
    };
  }

  // Helper method to create JWT token for existing user
  static createJwtTokenForUser(user: any): string {
    const jwt = require('jsonwebtoken');
    return jwt.sign({
      tenant_id: user.tenant_id,
      user_id: user.id,
      user_level: user.user_level,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
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
