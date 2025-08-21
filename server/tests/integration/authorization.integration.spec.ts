import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';
import * as bcrypt from 'bcryptjs';

describe('Authorization Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let serverUrl: string;

  beforeAll(async () => {
    app = await TestSetup.createTestingApp();
    prisma = TestSetup.prisma;
    serverUrl = TestSetup.getServerUrl();
  });

  afterAll(async () => {
    await TestSetup.closeApp();
  });

  beforeEach(async () => {
    await TestSetup.cleanupDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return JWT token', async () => {
      // Create a test business first (required for tenant_id foreign key)
      const testBusiness = await prisma.business.create({
        data: {
          company_name: 'Test Business',
          subscription: 1,
        },
      });

      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const testUser = await prisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          password: hashedPassword,
          user_level: 1,
          tenant_id: testBusiness.id,
        },
      });

      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(serverUrl)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expires_at');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'wrongpassword',
      };

      await request(serverUrl)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });

    it('should return 400 for missing required fields', async () => {
      const loginData = {
        username: 'testuser',
        // missing password
      };

      await request(serverUrl)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout and invalidate token', async () => {
      // Create a test business first
      const testBusiness = await prisma.business.create({
        data: {
          company_name: 'Test Business',
          subscription: 1,
        },
      });

      // Create a test user and get a valid token first
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          password: hashedPassword,
          user_level: 1,
          tenant_id: testBusiness.id,
        },
      });

      // First login to get a valid token
      const loginResponse = await request(serverUrl)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(200);

      const token = loginResponse.body.token;

      const response = await request(serverUrl)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Logout successful');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // Create a test business first
      const testBusiness = await prisma.business.create({
        data: {
          company_name: 'Test Business',
          subscription: 1,
        },
      });

      // Create a test user and get a valid token first
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          password: hashedPassword,
          user_level: 1,
          tenant_id: testBusiness.id,
        },
      });

      // First login to get a valid token
      const loginResponse = await request(serverUrl)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(200);

      const token = loginResponse.body.token;

      // Now test refresh
      const refreshResponse = await request(serverUrl)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(refreshResponse.body).toHaveProperty('token');
      expect(refreshResponse.body).toHaveProperty('expires_at');
      expect(typeof refreshResponse.body.token).toBe('string');
      expect(refreshResponse.body.token.length).toBeGreaterThan(0);
    });

    it('should return 401 for invalid token', async () => {
      const invalidToken = 'invalid-jwt-token';

      await request(serverUrl)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });
  });
});
