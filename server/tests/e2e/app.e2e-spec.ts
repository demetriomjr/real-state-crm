import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';
import * as bcrypt from 'bcryptjs';

describe('FlexSuite CRM API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let businessId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();
    await app.close();
  });

  describe('Complete Business Workflow', () => {
    it('should complete full business lifecycle', async () => {
      // Step 1: Create a new business with master user
      const businessData = {
        company_name: 'E2E Test Business',
        subscription: 2,
        master_user_fullName: 'Master User',
        master_user_username: 'masteruser',
        master_user_password: 'masterpass123',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/businesses')
        .send(businessData)
        .expect(201);

      expect(createResponse.body).toHaveProperty('business');
      expect(createResponse.body).toHaveProperty('master_user');
      expect(createResponse.body).toHaveProperty('auth');
      expect(createResponse.body.master_user.user_level).toBe(9);

      businessId = createResponse.body.business.id;
      authToken = createResponse.body.auth.token;

      // Step 2: Login with master user
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'masteruser',
          password: 'masterpass123',
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
      authToken = loginResponse.body.token;

      // Step 3: Create additional users for the business
      const userData = {
        username: 'employee1',
        fullName: 'Employee One',
        password: 'emp123',
        user_level: 1,
      };

      const userResponse = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      expect(userResponse.body).toHaveProperty('username', 'employee1');
      userId = userResponse.body.id;

      // Step 4: Get all users for the tenant
      const usersResponse = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(usersResponse.body).toBeInstanceOf(Array);
      expect(usersResponse.body.length).toBeGreaterThan(0);

      // Step 5: Update user
      const updateUserData = {
        fullName: 'Updated Employee One',
      };

      const updateUserResponse = await request(app.getHttpServer())
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserData)
        .expect(200);

      expect(updateUserResponse.body.fullName).toBe('Updated Employee One');

      // Step 6: Get business details
      const businessResponse = await request(app.getHttpServer())
        .get(`/api/businesses/${businessId}`)
        .expect(200);

      expect(businessResponse.body.company_name).toBe('E2E Test Business');

      // Step 7: Update business
      const updateBusinessData = {
        subscription: 3,
      };

      const updateBusinessResponse = await request(app.getHttpServer())
        .put(`/api/businesses/${businessId}`)
        .send(updateBusinessData)
        .expect(200);

      expect(updateBusinessResponse.body.subscription).toBe(3);

      // Step 8: Refresh token
      const refreshResponse = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(refreshResponse.body).toHaveProperty('token');

      // Step 9: Logout
      const logoutResponse = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(logoutResponse.body).toHaveProperty('message');
    });
  });

  describe('Authentication Flow', () => {
    it('should handle complete authentication flow', async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      await prisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          password: hashedPassword,
          user_level: 1,
          tenant_id: 'test-tenant',
        },
      });

      // Login
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'testpass123',
        })
        .expect(200);

      const token = loginResponse.body.token;

      // Try to access protected endpoint
      const protectedResponse = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Refresh token
      const refreshResponse = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Logout
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors properly', async () => {
      // Try to access protected endpoint without token
      await request(app.getHttpServer())
        .get('/api/users')
        .expect(401);

      // Try to login with invalid credentials
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpass',
        })
        .expect(401);
    });

    it('should handle validation errors properly', async () => {
      // Try to create business with invalid data
      await request(app.getHttpServer())
        .post('/api/businesses')
        .send({
          company_name: '', // Invalid: empty name
          subscription: 15, // Invalid: out of range
          master_user_fullName: 'John Doe',
          master_user_username: 'johndoe',
          master_user_password: 'password123',
        })
        .expect(400);
    });
  });

  describe('API Health and Documentation', () => {
    it('should serve landing page', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.text).toContain('FlexSuite');
    });

    it('should serve API documentation', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/docs')
        .expect(200);

      expect(response.text).toContain('Swagger');
    });

    it('should serve health check', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
