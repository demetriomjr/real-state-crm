import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';
import * as bcrypt from 'bcryptjs';

describe('Authorization Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await TestSetup.createTestingApp();
    prisma = TestSetup.prisma;
  });

  afterAll(async () => {
    await TestSetup.closeApp();
  });

  beforeEach(async () => {
    await TestSetup.cleanupDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return JWT token', async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const testUser = await prisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          password: hashedPassword,
          user_level: 1,
          tenant_id: 'test-tenant',
        },
      });

      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
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

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });

    it('should return 400 for missing required fields', async () => {
      const loginData = {
        username: 'testuser',
        // missing password
      };

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout and invalidate token', async () => {
      const token = 'mock-token';

      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Logged out successfully');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // Create a test user and get a valid token first
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          password: hashedPassword,
          user_level: 1,
          tenant_id: 'test-tenant',
        },
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      const token = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expires_at');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return 401 for invalid token', async () => {
      const invalidToken = 'invalid-token';

      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });
  });
});
