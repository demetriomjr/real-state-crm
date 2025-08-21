// Load environment variables from main .env file
require('dotenv').config({ path: '../.env' });

module.exports = {
  // Test Environment Variables
  env: {
    NODE_ENV: process.env.NODE_ENV || 'test',
    JWT_SECRET: process.env.JWT_SECRET || 'test-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    TEST_USER: process.env.TEST_USER || 'admin',
    TEST_PASSWORD: process.env.TEST_PASSWORD || 'test123',

  },
  
  // Test Database URL (for integration tests)
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/flexsuite_crm_test'
  },
  
  // Authentication credentials for testing
  auth: {
    testUser: {
      username: process.env.TEST_USER || 'admin',
      password: process.env.TEST_PASSWORD || 'test123',
      fullName: 'Test Admin User',
      user_level: 9,
      tenant_id: null // Will be generated randomly for each test
    }
  },

  // Test categories and their patterns
  testCategories: {
    unit: 'tests/unit/**/*.spec.ts',
    integration: 'tests/integration/**/*.spec.ts',
    e2e: 'tests/e2e/**/*.spec.ts',
    all: 'tests/**/*.spec.ts'
  },


};
