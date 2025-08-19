import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';

describe('Business Integration Tests', () => {
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

  describe('GET /api/businesses', () => {
    it('should return paginated list of businesses', async () => {
      // Create test businesses
      await prisma.business.createMany({
        data: [
          {
            company_name: 'Business 1',
            subscription: 1,
            tenant_id: 'tenant-1',
          },
          {
            company_name: 'Business 2',
            subscription: 2,
            tenant_id: 'tenant-2',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/businesses')
        .expect(200);

      expect(response.body).toHaveProperty('businesses');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body.businesses).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });

    it('should return empty list when no businesses exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/businesses')
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
          tenant_id: 'test-tenant',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/businesses/${business.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('company_name', 'Test Business');
      expect(response.body).toHaveProperty('subscription', 1);
    });

    it('should return 404 for non-existent business', async () => {
      await request(app.getHttpServer())
        .get('/api/businesses/non-existent-id')
        .expect(404);
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

      const response = await request(app.getHttpServer())
        .post('/api/businesses')
        .send(businessData)
        .expect(201);

      expect(response.body).toHaveProperty('business');
      expect(response.body).toHaveProperty('master_user');
      expect(response.body).toHaveProperty('auth');
      expect(response.body).toHaveProperty('message');
      expect(response.body.business.company_name).toBe('New Business');
      expect(response.body.master_user.username).toBe('johndoe');
      expect(response.body.master_user.user_level).toBe(9);
      expect(response.body.auth).toHaveProperty('token');
    });

    it('should return 409 when master user username already exists', async () => {
      // Create a user with the same username first
      await prisma.user.create({
        data: {
          username: 'johndoe',
          fullName: 'John Doe',
          password: 'hashedpassword',
          user_level: 1,
          tenant_id: 'existing-tenant',
        },
      });

      const businessData = {
        company_name: 'New Business',
        subscription: 1,
        master_user_fullName: 'John Doe',
        master_user_username: 'johndoe', // This username already exists
        master_user_password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/api/businesses')
        .send(businessData)
        .expect(409);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        company_name: '', // Invalid: empty name
        subscription: 15, // Invalid: out of range
        master_user_fullName: 'John Doe',
        master_user_username: 'johndoe',
        master_user_password: 'password123',
      };

      await request(app.getHttpServer())
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
          tenant_id: 'test-tenant',
        },
      });

      const updateData = {
        company_name: 'Updated Business',
        subscription: 2,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/businesses/${business.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.company_name).toBe('Updated Business');
      expect(response.body.subscription).toBe(2);
    });

    it('should return 404 for non-existent business', async () => {
      const updateData = {
        company_name: 'Updated Business',
      };

      await request(app.getHttpServer())
        .put('/api/businesses/non-existent-id')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/businesses/:id', () => {
    it('should soft delete business successfully', async () => {
      const business = await prisma.business.create({
        data: {
          company_name: 'Business to Delete',
          subscription: 1,
          tenant_id: 'test-tenant',
        },
      });

      await request(app.getHttpServer())
        .delete(`/api/businesses/${business.id}`)
        .expect(204);

      // Verify business is soft deleted
      const deletedBusiness = await prisma.business.findUnique({
        where: { id: business.id },
      });
      expect(deletedBusiness.deleted_at).not.toBeNull();
    });

    it('should return 404 for non-existent business', async () => {
      await request(app.getHttpServer())
        .delete('/api/businesses/non-existent-id')
        .expect(404);
    });
  });
});
