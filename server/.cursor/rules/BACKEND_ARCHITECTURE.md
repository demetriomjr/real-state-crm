# Project Architecture
- Clean Architecture folder design
    - Domain
        - Entities
        - Interfaces
    - Application
        - Controllers
        - Validators
    - Infrastructure
        - Databases
            - Migrations
            - Seeders
        - Repositories
    - Middlewares
    [Server files]

# Project Stack
- Node.js
- NestJS (minimal API Architecture oriented)
- TypeScript
- Axios
- Prettier
- ESLint
- Prisma
- PostgreSQL + Driver for Prisma
- Docker + Compose
- OpenAPI for Documentation
- npm CLI
- GIT
- Environment Variables File (.env)

# Architectural Rules
## Application Layer
- All routes must be driven by Controllers in the Application layer.
- Developer can ask for custom routes other than the RESTful ones.
- Controllers can be created from Domain Entities.
    - Each Controller is responsible for a specific Domain Entity.
    - Parent/Children pattern will be adopted and children won't have controllers, unless explicitly defined.
- Prime to creation, every Controller comes with all corresponding base routes
    - GET /{resource},
    - GET /{resource}/{id},
    - POST /{resource},
    - PUT /{resource}/{id},
    - DELETE /{resource}/{id}.
- Request/Response structs(DTOs) must be defined in the Application layer at `Application/DTOs/`.
    - Always create a Response DTO for each entity to conseal determinated data.
    - Response DTOs must always conseal tentant_id.
- Controller must be primely created with all attributes annotation(NestJS) correctly.
- All "FindAll" routes must be filtered by tenant_id.

## Infrastructure Layer
- Each Entity will have a repository for database rules.
- Automap id : UUID as primary key.
- Automap tenant_id : UUID as foreign key and required.
- Repositories follow CRUD special rules at `Infrastructure/Repositories/` as follow:
    - CREATE: Must return the created Entity.
    - READ: Must return the Entity or an array of Entities.
    - UPDATE: Must return the updated Entity.
    - DELETE: Must return a boolean indicating success or failure (soft delete).
    - PURGE: Must permanently delete the Entity and return a boolean indicating success or failure.
        - This scenario will have cascade delete behavior.
- Tenancy logic will be applied to all entities with tenant_id as foreign key.
    - Tenant_id will be required for all entities that are not root entities.
    - Tenant_id will be used to filter entities by tenant.
- Database Context
    - The database context will be responsible for managing the database connection and transactions.
    - It will provide a way to access the repositories for each Entity.
    - Developers can define custom database queries and transactions within the context.
    - Context will define auditing rules upon Entity creation, update, and deletion.
    - ID as UUID will be generated at creation.
    - All generic database rules explicit to ORM will be applied here.
- All meanings of configuring and setting must be done using Prisma.
- Migration and Seeding patterns must be defined and followed.

## Domain Layer
- Entities must be defined with all attributes and their types.
- Value Objects must be used for attributes that have specific rules or behaviors.
- Aggregates must be defined for entities that are treated as a single unit.
    - Saved some cases where aggregates can also be independent routes in the Application layer.

# Logging
- All logs must be done using NestJS Logger.
- Any error must be logged with the corresponding stack trace.
- Do not throw errors, use NestJS Logger to log them.

# Documentation
- Each Route(resource) should have a corresponding documentation file.
- Documentation should include:
    - Entity description
    - Attributes and their types
    - Relationships with other Entities
    - Example usage
- Follow OpenAPI specifications for documenting routes.