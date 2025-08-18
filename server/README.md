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
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

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

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/real_state_crm"

# Application
NODE_ENV=development
PORT=3000

# JWT (for authentication)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## 🐳 Docker

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- NestJS application
- Prisma migrations

## 📚 API Documentation

Once the server is running, you can access:
- **Health Check**: `GET /api/health`
- **API Root**: `GET /api`

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
