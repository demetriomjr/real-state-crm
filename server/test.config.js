module.exports = {
  // Test Environment Variables
  env: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h',
    TEST_USER: process.env.TEST_USER || 'admin',
    TEST_PASSWORD: process.env.TEST_PASSWORD || 'test123',
    MAJESTIC_PORT: process.env.MAJESTIC_PORT || 4000,
    MAJESTIC_ROOT_PATH: process.env.MAJESTIC_ROOT_PATH || '/Tests'
  },
  
  // Test Database URL (for integration tests)
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/flexsuite_crm_test'
  },
  
  // Authentication credentials for testing
  auth: {
    testUser: {
      username: process.env.TEST_USER || 'admin',
      password: process.env.TEST_PASSWORD || 'test123',
      fullName: 'Test Admin User',
      user_level: 9,
      tenant_id: 'test-tenant'
    }
  }
};
