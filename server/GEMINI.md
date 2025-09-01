# GEMINI - Project Rules & Architecture

## Architecture (Clean Architecture)
```
src/
├── Domain/          # Entities, Interfaces, Value Objects, Aggregates
├── Application/     # Controllers, DTOs, Services, Validators
└── Infrastructure/ # Database, Repositories
tests/              # unit, integration, e2e
```
- Parent/Children pattern: children won't have controllers unless explicitly defined
- Custom routes can be requested beyond RESTful ones

## Tech Stack
- **Backend**: Node.js, NestJS (minimal API Architecture), TypeScript, Prisma, PostgreSQL
- **HTTP**: Axios (not HttpService)
- **Testing**: Jest, Majestic
- **DevOps**: Docker, Docker Compose
- **Docs**: OpenAPI/Swagger
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm CLI
- **Version Control**: GIT
- **Environment**: .env file
- **Logger**: NestJS Logger

## Core Rules

### Controllers (Application Layer)
- All routes driven by Controllers
- Each Controller = one Domain Entity
- Base routes: GET /{resource}, GET /{resource}/{id}, POST /{resource}, PUT /{resource}/{id}, DELETE /{resource}/{id}
- All "FindAll" routes must filter by tenant_id
- Controllers handle user logic, levels, roles
- DTOs in `Application/DTOs/` - always create Response DTOs, conceal tenant_id
- Controllers must be created with all NestJS annotations correctly

### Services & Repositories
- **Service**: Business logic
- **Repository**: Database rules (CRUD + PURGE)
- CRUD returns: CREATE/READ/UPDATE → Entity, DELETE → boolean (soft delete)
- PURGE → boolean (permanent delete, cascade, not accessible via controllers)
- All entities need tenant_id (except root entities)
- UUID for primary keys

### Database
- Prisma for all DB operations
- Context manages connections, transactions, auditing
- Auto-generate UUID at creation
- Tenancy logic applied to all entities with tenant_id
- Migration and Seeding patterns must be defined and followed
- Custom database queries and transactions can be defined within context

### Code Standards
- **No comments** in code
- **No dependency injection** for Repositories/Controllers
- **No interface contracts** (Clean Architecture approach)
- **Early returns** pattern
- **Switch statements** over if-else chains
- **Avoid nesting** methods/functions
- **Avoid class instantiation** within methods
- **No magic numbers/strings** - use named constants
- **Use SOLID principles** to guide design
- **Use meaningful names** for variables, functions, classes
- **Respect spacing and indentation**
- **Avoid unnecessary whitespace and blank lines**
- **Use consistent naming conventions**
- **Method structure**:
  ```typescript
  function methodName(parameters) {
    <constants and variables>
    
    <conditions and logic>
    
    <return statement>
  }
  ```
- **Avoid intermediate constants** when not necessary:
  ```typescript
  // Bad
  const aConst = object.GetValue();
  const bConst = aConst.GetAnotherValue();
  
  // Good
  const finalConst = object.GetValue().GetAnotherValue();
  ```

### Logging
- Use NestJS Logger in every catch block
- Use Logger at Repositories and Services
- Log errors with stack trace
- Don't throw errors, log them instead

### Testing
- Jest + Majestic
- Create test files for every new controller
- Purge created entities after tests
- Add detail to screen UI log

### Documentation
- Each route needs OpenAPI documentation
- Include: entity description, attributes, relationships, examples

### Environment & Files
- Use existing .env file (don't create new ones)
- Don't delete files under /public without permission
- Windows 11 PowerShell terminal
- Don't create new folders without approval

### Dependencies
- Only install from Project Stack
- Use latest stable versions
- Prefer native modules over third-party
- Avoid deprecated packages
- Prefer package manager's built-in commands over manual installation