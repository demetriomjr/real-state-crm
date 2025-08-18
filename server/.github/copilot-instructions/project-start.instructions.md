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
        - Repositories
    <server files>

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
- Enviroment Files(.env)

# Architectural Rules
## Application Layer
- All routes must be driven by Controllers in the Application layer
- Developer can ask for custom routes other than the RESTful ones
- Controllers can be created from Domain Entities
    - Each Controller is responsible for a specific Domain Entity
    - Developer can call /create-controller-from #Entity in the Agent.
- Prime to creation, every Controller comes with all corresponding base routes
    - GET /{resource}
    - GET /{resource}/{id}
    - POST /{resource}
    - PUT /{resource}/{id}
    - DELETE /{resource}/{id}

## Infrastructure Layer
- Database
    - Start schema of database conenction
- Repositories
    - Create repository for #Entity

## Domain Layer
