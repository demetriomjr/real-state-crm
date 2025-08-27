import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';

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
      // Create a test business and user
      const { business, user } = await TestSetup.createTestBusinessAndUser('Test Business', 'testuser', 1);

      const loginData = {
        username: 'testuser',
        password: 'testpassword123',
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
      // Create a test business and user with token
      const { business, user, token } = await TestSetup.createTestBusinessAndUser('Test Business', 'logoutuser', 1);

      // First, login to get a fresh token
      const loginResponse = await request(serverUrl)
        .post('/api/auth/login')
        .send({
          username: 'logoutuser',
          password: 'testpassword123',
        })
        .expect(200);

      const freshToken = loginResponse.body.token;

      // Now logout
      await request(serverUrl)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${freshToken}`)
        .expect(200);

      // Try to logout again with the same token - should fail
      await request(serverUrl)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${freshToken}`)
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // Create a test business and user
      const { business, user } = await TestSetup.createTestBusinessAndUser('Test Business', 'refreshuser', 1);

      // First, login to get a token
      const loginResponse = await request(serverUrl)
        .post('/api/auth/login')
        .send({
          username: 'refreshuser',
          password: 'testpassword123',
        })
        .expect(200);

      const originalToken = loginResponse.body.token;

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));

      // Now refresh the token
      const refreshResponse = await request(serverUrl)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${originalToken}`)
        .expect(200);

      expect(refreshResponse.body).toHaveProperty('token');
      expect(refreshResponse.body).toHaveProperty('expires_at');
      
      // The refresh endpoint should return a valid response
      expect(refreshResponse.body.token).toBeDefined();
      expect(refreshResponse.body.expires_at).toBeDefined();
    });
  });
});
