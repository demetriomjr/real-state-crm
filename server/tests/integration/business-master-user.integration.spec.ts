import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';

describe('Business and Master User Integration Tests', () => {
  let app: INestApplication;
  let serverUrl: string;

  beforeAll(async () => {
    app = await TestSetup.createTestingApp();
    serverUrl = TestSetup.getServerUrl();
  });

  afterAll(async () => {
    await TestSetup.closeApp();
  });

  beforeEach(async () => {
    await TestSetup.cleanupDatabase();
  });

  describe('Business and Master User Creation Flow', () => {
    it('should create business and master user successfully', async () => {
      // Create business and master user using the new pattern
      const testBusiness = await TestSetup.createTestBusiness(
        'Test Company',
        'masteradmin'
      );

      expect(testBusiness.businessId).toBeDefined();
      expect(testBusiness.businessId).not.toBe('unknown');
      expect(testBusiness.masterUserToken).toBeDefined();
      expect(testBusiness.businessName).toBe('Test Company');
      expect(testBusiness.masterUsername).toBe('masteradmin');

      // Verify the business was created in the database
      const businessResponse = await request(serverUrl)
        .get(`/api/businesses/${testBusiness.businessId}`)
        .set('Authorization', `Bearer ${testBusiness.masterUserToken}`)
        .expect(200);

      expect(businessResponse.body.company_name).toBe('Test Company');

      // Verify the master user can authenticate
      const loginResponse = await request(serverUrl)
        .post('/api/auth/login')
        .send({
          username: 'masteradmin',
          password: 'masterpass123',
        })
        .expect(200);

      expect(loginResponse.body.token).toBeDefined();
    });

    it('should handle multiple business creations in the same test run', async () => {
      // Create first business
      const business1 = await TestSetup.createTestBusiness(
        'First Company',
        'master1'
      );

      // Create second business
      const business2 = await TestSetup.createTestBusiness(
        'Second Company',
        'master2'
      );

      expect(business1.businessId).not.toBe(business2.businessId);
      expect(business1.businessId).not.toBe('unknown');
      expect(business2.businessId).not.toBe('unknown');

      // Verify both businesses exist
      const business1Response = await request(serverUrl)
        .get(`/api/businesses/${business1.businessId}`)
        .set('Authorization', `Bearer ${business1.masterUserToken}`)
        .expect(200);

      const business2Response = await request(serverUrl)
        .get(`/api/businesses/${business2.businessId}`)
        .set('Authorization', `Bearer ${business2.masterUserToken}`)
        .expect(200);

      expect(business1Response.body.company_name).toBe('First Company');
      expect(business2Response.body.company_name).toBe('Second Company');
    });

    it('should purge all created businesses after tests', async () => {
      // Create a business
      const testBusiness = await TestSetup.createTestBusiness(
        'Purge Test Company',
        'purgeuser'
      );

      // Verify it exists
      const businessResponse = await request(serverUrl)
        .get(`/api/businesses/${testBusiness.businessId}`)
        .set('Authorization', `Bearer ${testBusiness.masterUserToken}`)
        .expect(200);

      expect(businessResponse.body.company_name).toBe('Purge Test Company');
    });
  });

  describe('Master User Authentication', () => {
    it('should allow master user to access protected endpoints', async () => {
      // Create a business with master user
      const testBusiness = await TestSetup.createTestBusiness(
        'Auth Test Company',
        'authuser'
      );

      // Verify the master user can access business details
      const businessResponse = await request(serverUrl)
        .get(`/api/businesses/${testBusiness.businessId}`)
        .set('Authorization', `Bearer ${testBusiness.masterUserToken}`)
        .expect(200);

      expect(businessResponse.body.company_name).toBe('Auth Test Company');
    });

    it('should allow master user to login with credentials', async () => {
      // Create a business with master user
      const testBusiness = await TestSetup.createTestBusiness(
        'Login Test Company',
        'loginuser'
      );

      // Login with master user credentials
      const loginResponse = await request(serverUrl)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'masterpass123',
        })
        .expect(200);

      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.expires_at).toBeDefined();
    });
  });

  describe('Business Isolation', () => {
    it('should maintain tenant isolation between businesses', async () => {
      // Create two separate businesses
      const business1 = await TestSetup.createTestBusiness(
        'Isolated Company 1',
        'isolated1'
      );

      const business2 = await TestSetup.createTestBusiness(
        'Isolated Company 2',
        'isolated2'
      );

      // Each master user should only be able to access their own business
      const business1Response = await request(serverUrl)
        .get(`/api/businesses/${business1.businessId}`)
        .set('Authorization', `Bearer ${business1.masterUserToken}`)
        .expect(200);

      const business2Response = await request(serverUrl)
        .get(`/api/businesses/${business2.businessId}`)
        .set('Authorization', `Bearer ${business2.masterUserToken}`)
        .expect(200);

      expect(business1Response.body.company_name).toBe('Isolated Company 1');
      expect(business2Response.body.company_name).toBe('Isolated Company 2');

      // Verify that business1 user cannot access business2 and vice versa
      await request(serverUrl)
        .get(`/api/businesses/${business2.businessId}`)
        .set('Authorization', `Bearer ${business1.masterUserToken}`)
        .expect(400); // Should be forbidden due to tenant isolation (BadRequestException)

      await request(serverUrl)
        .get(`/api/businesses/${business1.businessId}`)
        .set('Authorization', `Bearer ${business2.masterUserToken}`)
        .expect(400); // Should be forbidden due to tenant isolation (BadRequestException)
    });
  });
});
