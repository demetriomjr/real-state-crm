import { PrismaClient } from '@prisma/client';
import { TestBusinessManager } from './helpers/test-business-setup';

// Load environment variables from main .env file
require('dotenv').config({ path: '../.env' });

const prisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Set test environment variables from .env
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  process.env.TEST_USER = process.env.TEST_USER || 'admin';
  process.env.TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';

  // Reset database before running any tests
  await resetDatabase();
  
  // Reset test business manager
  TestBusinessManager.reset();
});

// Global test teardown
afterAll(async () => {
  // Cleanup any global resources
  await prisma.$disconnect();
});

// Reset database function
async function resetDatabase() {
  try {
    console.log('🧹 Resetting database for test consistency...');
    
    // Delete all data in reverse order of dependencies
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();
    
    console.log('✅ Database reset completed');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
