# FlexSuite CRM Test Suite

This directory contains comprehensive tests for the FlexSuite CRM API, following NestJS testing standards and best practices.

## 📁 Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── authorization.controller.spec.ts
│   ├── user.controller.spec.ts
│   └── business.controller.spec.ts
├── integration/             # Integration tests with database
│   ├── setup.ts
│   ├── authorization.integration.spec.ts
│   └── business.integration.spec.ts
├── e2e/                    # End-to-end tests
│   └── app.e2e-spec.ts
├── results/                 # Test result reports
├── setup.ts                 # Global test setup
├── run-tests.ts            # Test runner script
└── README.md               # This file
```

## 🧪 Test Types

### Unit Tests (`tests/unit/`)
- **Purpose**: Test individual components in isolation
- **Coverage**: Controllers, Services, Validators
- **Mocking**: All external dependencies are mocked
- **Speed**: Fast execution, no database required

### Integration Tests (`tests/integration/`)
- **Purpose**: Test component interactions with real database
- **Coverage**: API endpoints with actual data persistence
- **Database**: Uses test database with cleanup between tests
- **Real Dependencies**: Tests actual service implementations

### E2E Tests (`tests/e2e/`)
- **Purpose**: Test complete application workflows
- **Coverage**: Full business scenarios from start to finish
- **Real Application**: Tests the entire application stack
- **User Scenarios**: Complete user journeys and workflows

## 🚀 Running Tests

### Individual Test Types
```bash
# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e
```

### All Tests with Report
```bash
# Run all tests and generate detailed report
npm run test:all
```

### Other Test Commands
```bash
# Run all tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run tests with debugging
npm run test:debug
```

## 📊 Test Coverage

### Controllers Tested
- ✅ **AuthorizationController**
  - Login with valid/invalid credentials
  - Logout functionality
  - Token refresh
  - Error handling

- ✅ **UserController**
  - CRUD operations with tenant isolation
  - Authentication requirements
  - Master user protection (level 9)
  - Validation and error handling

- ✅ **BusinessController**
  - Business creation with master user
  - CRUD operations
  - Transaction handling
  - Validation and error handling

### Workflows Tested
- ✅ **Authentication Flow**
  - User registration → Login → Token refresh → Logout
  - Invalid credential handling
  - Token validation

- ✅ **Business Workflow**
  - Business creation → Master user creation → User management
  - Complete lifecycle from creation to deletion
  - Multi-tenant isolation

- ✅ **Error Handling**
  - Validation errors
  - Authentication errors
  - Database errors
  - Business logic errors

## 📄 Test Reports

Test results are automatically saved to `tests/results/` with the following format:
- `test-<type>-<date>-<time>.txt`

Reports include:
- Test summary (passed/failed/total)
- Success rate percentage
- Execution duration
- Test coverage breakdown
- Detailed error information

## 🔧 Test Configuration

### Environment Variables
Tests use the following environment variables:
```env
NODE_ENV=test
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1h
```

### Database Setup
- Integration and E2E tests use a test database
- Data is automatically cleaned up between tests
- No production data is affected

### Mocking Strategy
- Unit tests: All external dependencies mocked
- Integration tests: Real database, mocked external services
- E2E tests: Full real application stack

## 🛠️ Adding New Tests

### Unit Test Template
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourController } from '../../src/Application/Controllers/your.controller';
import { YourService } from '../../src/Application/Services/your.service';

describe('YourController (Unit)', () => {
  let controller: YourController;
  let service: YourService;

  const mockService = {
    // Mock methods here
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YourController],
      providers: [
        {
          provide: YourService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<YourController>(YourController);
    service = module.get<YourService>(YourService);
  });

  describe('yourMethod', () => {
    it('should do something', async () => {
      // Test implementation
    });
  });
});
```

### Integration Test Template
```typescript
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './setup';

describe('Your Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await TestSetup.createTestingApp();
  });

  afterAll(async () => {
    await TestSetup.closeApp();
  });

  beforeEach(async () => {
    await TestSetup.cleanupDatabase();
  });

  describe('POST /api/your-endpoint', () => {
    it('should do something', async () => {
      // Test implementation
    });
  });
});
```

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure test database is running
2. **Environment Variables**: Check test environment setup
3. **Port Conflicts**: Tests use different ports to avoid conflicts
4. **Timeout Issues**: Increase timeout in Jest config if needed

### Debug Mode
```bash
# Run tests with debugging enabled
npm run test:debug
```

## 📈 Continuous Integration

Tests are designed to run in CI/CD pipelines:
- Fast execution for quick feedback
- Isolated test environments
- Comprehensive coverage reporting
- Automated result logging

## 🤝 Contributing

When adding new features:
1. Write unit tests for new components
2. Add integration tests for new endpoints
3. Create E2E tests for new workflows
4. Update test documentation
5. Ensure all tests pass before merging
