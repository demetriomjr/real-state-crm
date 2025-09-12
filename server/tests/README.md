# FlexSuite CRM - Test Suite

This directory contains the comprehensive test suite for the FlexSuite CRM application, featuring an advanced Majestic UI for test execution and monitoring.

## 🚀 Quick Start

### 1. Start the Test UI
```bash
npm run test:ui:start
```

### 2. Access the Test Interface
- **Dashboard**: http://localhost:4000
- **Majestic UI**: http://localhost:4000/Tests
- **Credentials**: admin / test123

## 📁 Test Structure

```
tests/
├── unit/                 # Unit tests for individual components
├── integration/          # Integration tests for API endpoints
├── e2e/                 # End-to-end tests for complete workflows
├── helpers/             # Test utilities and helpers
├── results/             # Test execution results and reports
├── setup.ts             # Global test configuration
└── run-tests.ts         # Comprehensive test runner
```

## 🧪 Test Categories

### Unit Tests
- **Location**: `tests/unit/`
- **Command**: `npm run test:unit`
- **Purpose**: Test individual functions, classes, and components in isolation

### Integration Tests
- **Location**: `tests/integration/`
- **Command**: `npm run test:integration`
- **Purpose**: Test API endpoints and service interactions

### End-to-End Tests
- **Location**: `tests/e2e/`
- **Command**: `npm run test:e2e`
- **Purpose**: Test complete user workflows and scenarios

## 🎯 Majestic UI Features

### Real-time Test Execution
- Interactive test runner with live logging
- Color-coded output (green for success, red for errors, yellow for warnings)
- Real-time status updates and progress tracking

### Test Management
- Run specific test categories (unit, integration, e2e)
- View test results and coverage reports
- Access test execution history

### Authentication
- Basic authentication protection
- Configurable test credentials
- Secure access to test environment

## 🔧 Configuration

### Environment Variables
Create a `test.env` file with the following configuration:

```env
# Test Environment Configuration
NODE_ENV=test
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1h

# Test Authentication Credentials
TEST_USER=admin
TEST_PASSWORD=test123

# Majestic UI Configuration
MAJESTIC_PORT=4000
MAJESTIC_ROOT_PATH=/Tests

# Database Configuration (for integration tests)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flexsuite_crm_test
```

### Test Configuration Files
- `test.config.js` - Test environment configuration
- `majestic.config.js` - Majestic UI configuration
- `jest.config.js` - Jest test runner configuration

## 📊 Test Commands

### Basic Commands
```bash
# Run all tests
npm run test:all

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### UI Commands
```bash
# Start the test UI
npm run test:ui:start

# Start the test UI in development mode
npm run test:ui:dev

# Run the simple Majestic UI
npm run test:ui:simple
```

### Advanced Commands
```bash
# Run tests with debug information
npm run test:debug

# Run specific test file
npm test -- tests/unit/user.controller.spec.ts

# Run tests with custom configuration
npm test -- --config=jest.config.js
```

## 🔍 Test Coverage

The test suite provides comprehensive coverage for:

- **Authorization Controller**: Login, logout, token validation
- **User Controller**: CRUD operations, validation, authentication
- **Business Controller**: Business management, tenant isolation
- **Authentication Flow**: Complete JWT-based authentication
- **Error Handling**: Validation errors, authentication errors
- **Database Operations**: Repository layer testing

## 📈 Test Results

### Coverage Targets
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Result Storage
Test results are automatically saved to `tests/results/` with:
- Detailed execution logs
- Coverage reports
- Performance metrics
- Error analysis

## 🛠️ Development

### Adding New Tests
1. Create test files with `.spec.ts` extension
2. Place in appropriate category directory
3. Follow naming convention: `[component].spec.ts`
4. Use descriptive test names and proper assertions

### Test Helpers
- `tests/helpers/test-auth.ts` - Authentication utilities
- `tests/setup.ts` - Global test configuration
- `tests/integration/setup.ts` - Integration test setup

### Best Practices
- Use descriptive test names
- Test both success and failure scenarios
- Mock external dependencies
- Clean up test data after each test
- Follow AAA pattern (Arrange, Act, Assert)

## 🔐 Security

### Test Environment Isolation
- Separate test database
- Isolated test credentials
- No access to production data
- Secure authentication testing

### Data Cleanup
- Automatic cleanup of test data
- Tenant isolation in tests
- Proper resource disposal
- No data leakage between tests

## 🚨 Troubleshooting

### Common Issues
1. **Port already in use**: Change `MAJESTIC_PORT` in `test.env`
2. **Database connection**: Ensure test database is running
3. **Authentication errors**: Verify test credentials in `test.env`
4. **Test failures**: Check test logs in `tests/results/`

### Debug Mode
```bash
# Run tests with debug information
npm run test:debug

# Run specific test with verbose output
npm test -- --verbose tests/unit/user.controller.spec.ts
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Majestic UI](https://github.com/Raathigesh/majestic)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

## 👥 Contributing

When adding new tests:
1. Follow existing patterns and conventions
2. Ensure proper test coverage
3. Update this documentation if needed
4. Run the full test suite before submitting

---

**Developed by Demetrio M Jr | FlexSuite CRM**
