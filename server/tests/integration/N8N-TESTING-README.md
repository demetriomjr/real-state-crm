# N8N Routes Integration Testing

This directory contains comprehensive integration tests for all N8N webhook endpoints in the WhatsApp CRM system.

## Overview

The N8N flow handles WhatsApp session management and messaging through several webhook endpoints. This test suite validates all endpoints with both valid and invalid data scenarios.

## Test Coverage

### 1. SessionManager Hook - `POST /whatsapp/sessions`
**Purpose**: Creates and manages WhatsApp sessions
**Validation Rules**:
- `session_id`: Must be a valid UUID
- `tenant_id`: Must be a valid UUID
- Both fields are required

**Test Scenarios**:
- ✅ Valid session_id and tenant_id
- ❌ Invalid session_id (non-UUID)
- ❌ Invalid tenant_id (non-UUID)
- ❌ Missing session_id
- ❌ Missing tenant_id

### 2. StartSession Hook - `POST /whatsapp/session/start`
**Purpose**: Starts an existing WhatsApp session
**Validation Rules**:
- `session_id`: Must be a valid UUID
- Field is required

**Test Scenarios**:
- ✅ Valid session_id
- ❌ Invalid session_id (non-UUID)
- ❌ Missing session_id

### 3. SessionAuth Hook - `POST /whatsapp/auth`
**Purpose**: Generates QR code for WhatsApp authentication
**Validation Rules**:
- `session_id`: Must be a valid UUID
- Field is required

**Test Scenarios**:
- ✅ Valid session_id
- ❌ Invalid session_id (non-UUID)
- ❌ Missing session_id

### 4. SendMessage Hook - `POST /whatsapp/sendMessage`
**Purpose**: Sends WhatsApp messages
**Validation Rules**:
- `session_id`: Must be a valid UUID
- `contact`: Must be a valid phone number (12+ digits)
- `message`: Must not be empty
- All fields are required

**Test Scenarios**:
- ✅ Valid session_id, contact, and message
- ❌ Invalid session_id (non-UUID)
- ❌ Invalid contact (short phone number)
- ❌ Empty message
- ❌ Missing session_id
- ❌ Missing contact
- ❌ Missing message

### 5. IncomingMessage Webhook - `POST /whatsapp`
**Purpose**: Processes incoming WhatsApp messages
**Validation Rules**:
- Accepts incoming message payloads from N8N
- Handles malformed data gracefully

**Test Scenarios**:
- ✅ Valid incoming message payload
- ❌ Malformed message payload

## Running Tests

### Run All N8N Route Tests
```bash
npm run test:integration:n8n-routes
```

### Run Individual Test Files
```bash
# All N8N routes comprehensive test
npm run test:integration -- tests/integration/n8n-all-routes.integration.spec.ts

# Individual endpoint tests
npm run test:integration -- tests/integration/session-manager.integration.spec.ts
npm run test:integration -- tests/integration/session-start.integration.spec.ts
npm run test:integration -- tests/integration/session-auth.integration.spec.ts
npm run test:integration -- tests/integration/send-message.integration.spec.ts
npm run test:integration -- tests/integration/webhook.integration.spec.ts
```

### Run with Verbose Output
```bash
npm run test:integration:n8n -- --verbose
```

## Test Configuration

### Environment Variables
Tests use the following configuration from `test-config.ts`:

```typescript
export const TEST_CONFIG = {
  WAHA_BASE_URL: "http://localhost:3100",
  SESSION_NAME: "default",
  N8N_BASE_URL: "http://localhost:5678",
  TEST_TENANT_ID: "test-tenant-123",
  TEST_PHONE: "5511999999999",
  TEST_SESSION_ID: "test-session-123",
  // ... other config
};
```

### Test Data Generation
Tests use utility functions to generate valid and invalid test data:

```typescript
const generateValidUUID = () => "12345678-1234-1234-1234-123456789012";
const generateInvalidUUID = () => "invalid-uuid";
const generateValidPhone = () => "5511999999999";
const generateInvalidPhone = () => "123";
```

## Test Structure

### Main Test File: `n8n-all-routes.integration.spec.ts`
Contains comprehensive tests for all endpoints with:
- Valid data scenarios
- Invalid data scenarios
- Missing field scenarios
- Integration flow tests

### Test Runner: `run-all-n8n-routes-tests.ts`
Executes all N8N-related test files and provides:
- Detailed test results
- Success/failure summary
- Performance metrics
- Error reporting

## Expected Test Results

### Successful Test Run
```
🚀 Starting N8N Routes Integration Tests
============================================================

📋 Running: tests/integration/n8n-all-routes.integration.spec.ts
--------------------------------------------------
✅ tests/integration/n8n-all-routes.integration.spec.ts - PASSED (2500ms)

============================================================
📊 N8N ROUTES TEST SUMMARY
============================================================
⏱️  Total Duration: 15000ms
📈 Total Tests: 7
✅ Passed: 7
❌ Failed: 0
⏭️  Skipped: 0
📊 Success Rate: 100.0%

🎉 ALL N8N ROUTES TESTS PASSED!
```

### Failed Test Run
```
❌ tests/integration/n8n-all-routes.integration.spec.ts - FAILED
Error: Expected status 200 but got 500

============================================================
📊 N8N ROUTES TEST SUMMARY
============================================================
⏱️  Total Duration: 12000ms
📈 Total Tests: 7
✅ Passed: 6
❌ Failed: 1
⏭️  Skipped: 0
📊 Success Rate: 85.7%

❌ FAILED TESTS:
  - tests/integration/n8n-all-routes.integration.spec.ts
    Error: Expected status 200 but got 500...

💥 SOME TESTS FAILED!
```

## Troubleshooting

### Common Issues

1. **WAHA Service Not Running**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3100
   ```
   **Solution**: Start WAHA service with `docker-compose up waha`

2. **N8N Service Not Running**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:5678
   ```
   **Solution**: Start N8N service with `docker-compose up n8n`

3. **Database Connection Issues**
   ```
   Error: PrismaClientInitializationError
   ```
   **Solution**: Ensure database is running and migrations are applied

4. **Test Timeout Issues**
   ```
   Error: Timeout - Async callback was not invoked
   ```
   **Solution**: Increase timeout values in test configuration

### Debug Mode
Run tests in debug mode for detailed logging:
```bash
npm run test:debug -- tests/integration/n8n-all-routes.integration.spec.ts
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run N8N Integration Tests
  run: |
    docker-compose up -d
    npm run test:integration:n8n-routes
    docker-compose down
```

### Pre-commit Hook
```bash
#!/bin/sh
npm run test:integration:n8n-routes
```

## Contributing

When adding new N8N endpoints or modifying existing ones:

1. Update the test file with new test scenarios
2. Add validation rules to the documentation
3. Update the test runner if needed
4. Run the full test suite to ensure compatibility
5. Update this README with new endpoint information

## Related Files

- `tests/integration/test-config.ts` - Test configuration
- `tests/integration/test-utils.ts` - Test utilities
- `resources/waha-n8n-flow.json` - N8N flow definition
- `src/Application/Services/n8n-whatsapp.service.ts` - Service implementation
