# Real State CRM Server

A NestJS-based CRM server for real estate management built with Clean Architecture principles.

## 🏗️ Architecture

This project follows Clean Architecture with the following structure:

```
src/
├── Domain/           # Business logic and entities
│   ├── Entities/     # Domain entities
│   ├── Interfaces/   # Domain interfaces
│   ├── Users/        # User-related entities
│   └── Business/     # Business-related entities
├── Application/      # Application services and controllers
│   ├── Controllers/  # HTTP controllers
│   └── Validators/   # Data validation
└── Infrastructure/   # External concerns
    ├── Database/     # Database configuration
    │   ├── Migrations/
    │   └── Seeders/
    └── Repositories/ # Data access layer
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the database**
   ```bash
   # Using Docker (recommended)
   docker-compose up postgres -d
   
   # Or connect to your existing PostgreSQL instance
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📋 Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run test:ui` - Start Majestic Test UI dashboard
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:e2e` - Run E2E tests only
- `npm run test:all` - Run all tests with detailed report
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

## 🧪 Test Suite & UI Dashboard

The project includes a comprehensive test suite with a beautiful UI dashboard powered by Majestic:

### Test UI Dashboard
```bash
# Start the test UI dashboard
npm run test:ui
```

**Access Information:**
- **Dashboard URL**: `http://localhost:4000/Tests`
- **Landing Page**: `http://localhost:4000`
- **Authentication**: `admin` / `test123`

### Test Coverage
- **Unit Tests**: 12 tests (Controllers, Services, Validators)
- **Integration Tests**: 8 tests (Database operations)
- **E2E Tests**: 5 tests (Complete workflows)
- **Total Coverage**: 100%

### Test Commands
```bash
# Individual test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only

# Complete test suite
npm run test:all          # All tests with detailed report
npm run test:cov          # Coverage report
npm run test:watch        # Watch mode
```

### Test Configuration
Test credentials and environment are configured in `test.config.js`:
- **Test User**: `admin`
- **Test Password**: `test123`
- **JWT Secret**: `test-secret-key`
- **Test Database**: Separate test database for isolation

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL and includes:

- **Audit fields**: Automatic tracking of creation, updates, and soft deletes
- **UUID primary keys**: Secure and globally unique identifiers
- **Multi-tenancy support**: Tenant-based data isolation
- **Soft deletes**: Data preservation with logical deletion

### Key Entities

- **User**: System users with role-based access
- **UserRole**: User permissions and roles
- **Business**: Tenant organizations with subscription levels

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/real_state_crm"

# Application
NODE_ENV=development
PORT=3000

# JWT (for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=30m
```

**Important**: 
- Change the `JWT_SECRET` to a strong, unique secret in production
- The `JWT_EXPIRES_IN` is set to 30 minutes by default
- In development mode, some authentication validations may be bypassed

## 🐳 Docker

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- NestJS application
- Prisma migrations

## 🔐 Authentication & Authorization

The application includes a comprehensive JWT-based authentication system with multi-tenancy support:

### Authentication Endpoints

- **POST /api/auth/login** - Authenticate user and get JWT token
- **POST /api/auth/logout** - Logout and invalidate token
- **POST /api/auth/refresh** - Refresh JWT token

### Features

- **JWT Tokens**: 30-minute expiration with automatic refresh capability
- **Multi-tenancy**: All operations are scoped to the user's tenant
- **Token Invalidation**: Secure logout with token blacklisting
- **Development Mode**: Optional validation bypass for development
- **Local Cache**: Efficient token management with automatic cleanup

### Protected Endpoints

All user management endpoints now require authentication:
- **GET /api/users** - Get users (scoped to tenant)
- **GET /api/users/:id** - Get specific user
- **POST /api/users** - Create new user
- **PUT /api/users/:id** - Update user
- **DELETE /api/users/:id** - Delete user (cannot delete master users)

### Business Management

Business endpoints for tenant management:
- **GET /api/businesses** - Get all businesses (public)
- **GET /api/businesses/:id** - Get specific business (public)
- **POST /api/businesses** - Create new business with master user
- **PUT /api/businesses/:id** - Update business (protected)
- **DELETE /api/businesses/:id** - Delete business (protected)

**Important**: Business creation automatically creates a master user (level 9) who cannot be deleted and has full administrative privileges.

## 📚 API Documentation

Once the server is running, you can access:
- **Landing Page**: `GET /` - Beautiful FlexSuite homepage
- **Health Check**: `GET /api/health`
- **API Root**: `GET /api`
- **Swagger Documentation**: `GET /api/docs`

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## 📝 Development Guidelines

- Follow Clean Architecture principles
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for business logic
- Use Prisma for database operations
- Follow NestJS conventions

## 📄 License

This project is licensed under the ISC License.
