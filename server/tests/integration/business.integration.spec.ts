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
      // Create test business and user with proper token
      const { business, user, token } = await TestSetup.createTestBusinessAndUser('Business 1', 'admin1', 10);

      // Create additional test businesses
      await prisma.business.createMany({
        data: [
          {
            company_name: 'Business 2',
            subscription: 2,
          },
          {
            company_name: 'Business 3',
            subscription: 3,
          },
        ],
      });
      
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
      // Don't create any businesses, just create a user token
      const { token } = await TestSetup.createTestBusinessAndUser('Test Business', 'admin2', 10);
      
      // Delete the business that was created by createTestBusinessAndUser
      await prisma.business.deleteMany();
      
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
      const { business, user, token } = await TestSetup.createTestBusinessAndUser('Test Business', 'admin3', 10);
      
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
        master_user_fullName: 'Master User',
        master_user_username: 'masteruser',
        master_user_password: 'masterpass123',
      };

      const response = await request(serverUrl)
        .post('/api/businesses')
        .send(businessData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expires_at');
    });

    it('should return 409 when master user username already exists', async () => {
      // First, create a business with the username
      const { user } = await TestSetup.createTestBusinessAndUser('Existing Business', 'masteruser', 10);

      const businessData = {
        company_name: 'New Business',
        subscription: 1,
        master_user_fullName: 'Master User',
        master_user_username: 'masteruser', // Same username
        master_user_password: 'masterpass123',
      };

      await request(serverUrl)
        .post('/api/businesses')
        .send(businessData)
        .expect(409);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        company_name: '', // Invalid: empty name
        subscription: 'invalid', // Invalid: not a number
      };

      await request(serverUrl)
        .post('/api/businesses')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('PUT /api/businesses/:id', () => {
    it('should update business successfully', async () => {
      const { business, user, token } = await TestSetup.createTestBusinessAndUser('Original Business', 'admin4', 10);

      const updateData = {
        company_name: 'Updated Business',
        subscription: 2,
      };

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
      const { business, user, token } = await TestSetup.createTestBusinessAndUser('Delete Business', 'admin5', 10);

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
      expect(deletedBusiness!.deleted_by).toBe('system');
    });
  });
});
