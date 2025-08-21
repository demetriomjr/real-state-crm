import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';

describe('Business Integration Tests', () => {
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

  describe('GET /api/businesses', () => {
    it('should return paginated list of businesses', async () => {
      // Create test businesses
      await prisma.business.createMany({
        data: [
          {
            company_name: 'Business 1',
            subscription: 1,
          },
          {
            company_name: 'Business 2',
            subscription: 2,
          },
        ],
      });

      // Create JWT token for developer access
      const token = TestSetup.createTestJwtToken('developer', 10);
      
      const response = await request(serverUrl)
        .get('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('businesses');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.businesses)).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
    });

    it('should return empty list when no businesses exist', async () => {
      // Create JWT token for developer access
      const token = TestSetup.createTestJwtToken('developer', 10);
      
      const response = await request(serverUrl)
        .get('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.businesses).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });
  });

  describe('GET /api/businesses/:id', () => {
    it('should return business by id', async () => {
      const business = await prisma.business.create({
        data: {
          company_name: 'Test Business',
          subscription: 1,
        },
      });

      // Create a user that belongs to this business
      const user = await prisma.user.create({
        data: {
          username: 'testadmin',
          fullName: 'Test Admin',
          password: 'hashedpassword',
          user_level: 9, // Admin level
          tenant_id: business.id,
        },
      });

      // Create JWT token for this user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({
        tenant_id: business.id,
        username: user.username,
        user_level: user.user_level,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      }, process.env.JWT_SECRET || 'test-secret-key');
      
      const response = await request(serverUrl)
        .get(`/api/businesses/${business.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('company_name', 'Test Business');
      expect(response.body).toHaveProperty('subscription', 1);
    });
  });

  describe('POST /api/businesses', () => {
    it('should create business with master user successfully', async () => {
      const businessData = {
        company_name: 'New Business',
        subscription: 1,
        master_user_fullName: 'John Doe',
        master_user_username: 'johndoe',
        master_user_password: 'password123',
      };

      const response = await request(serverUrl)
        .post('/api/businesses')
        .send(businessData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expires_at');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 409 when master user username already exists', async () => {
      // Create a business first to get a valid tenant_id
      const existingBusiness = await prisma.business.create({
        data: {
          company_name: 'Existing Business',
          subscription: 1,
        },
      });

      // Create a user with the same username first
      await prisma.user.create({
        data: {
          username: 'johndoe',
          fullName: 'John Doe',
          password: 'hashedpassword',
          user_level: 1,
          tenant_id: existingBusiness.id,
        },
      });

      // Now try to create a new business with the same master user username
      const businessData = {
        company_name: 'New Business',
        subscription: 1,
        master_user_fullName: 'John Doe',
        master_user_username: 'johndoe', // Same username that already exists
        master_user_password: 'password123',
      };

      await request(serverUrl)
        .post('/api/businesses')
        .send(businessData)
        .expect(409);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        company_name: '', // Invalid: empty name
        subscription: -1, // Invalid: negative subscription
      };

      await request(serverUrl)
        .post('/api/businesses')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('PUT /api/businesses/:id', () => {
    it('should update business successfully', async () => {
      const business = await prisma.business.create({
        data: {
          company_name: 'Original Business',
          subscription: 1,
        },
      });

      const updateData = {
        company_name: 'Updated Business',
        subscription: 2,
      };

      // Create a user that belongs to this business for authentication
      const user = await prisma.user.create({
        data: {
          username: 'updateuser',
          fullName: 'Update User',
          password: 'hashedpassword',
          user_level: 9, // Admin level
          tenant_id: business.id,
        },
      });

      // Create JWT token for this user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({
        tenant_id: business.id,
        username: user.username,
        user_level: user.user_level,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      }, process.env.JWT_SECRET || 'test-secret-key');

      const response = await request(serverUrl)
        .put(`/api/businesses/${business.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.company_name).toBe('Updated Business');
      expect(response.body.subscription).toBe(2);
    });
  });

  describe('DELETE /api/businesses/:id', () => {
    it('should soft delete business successfully', async () => {
      const business = await prisma.business.create({
        data: {
          company_name: 'Business to Delete',
          subscription: 1,
        },
      });

      // Create a developer user that belongs to this business for authentication
      const developerUser = await prisma.user.create({
        data: {
          username: 'developeruser',
          fullName: 'Developer User',
          password: 'hashedpassword',
          user_level: 10, // Developer level
          tenant_id: business.id,
        },
      });

      // Create JWT token for this user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({
        tenant_id: business.id,
        username: developerUser.username,
        user_level: developerUser.user_level,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      }, process.env.JWT_SECRET || 'test-secret-key');

      await request(serverUrl)
        .delete(`/api/businesses/${business.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify business is soft deleted
      const deletedBusiness = await prisma.business.findUnique({
        where: { id: business.id },
      });

      expect(deletedBusiness).not.toBeNull();
      expect(deletedBusiness!.deleted_at).not.toBeNull();
    });
  });
});
