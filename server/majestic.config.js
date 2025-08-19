module.exports = {
  // Jest configuration
  jestScriptPath: 'npm run test',
  
  // Test file patterns
  testFilePattern: '**/*.spec.ts',
  
  // Coverage configuration
  coverage: {
    enabled: true,
    threshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  },
  
  // Test environment
  env: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h'
  },
  
  // Custom port for Majestic UI
  port: 4000,
  
  // Root path for the UI
  rootPath: '/Tests',
  
  // Authentication (if needed)
  auth: {
    enabled: true,
    username: process.env.TEST_USER || 'admin',
    password: process.env.TEST_PASSWORD || 'test123'
  }
};
