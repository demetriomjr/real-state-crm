# Workflow

1 - Create the project using NPM.
2 - Install all declared dependencies.
3 - Create folder scaffolding arcchitecture.
4 - Start server main files with all dependencies needed.
5 - Configure NestJS to begin mapping Controllers folder for routes.
6 - Create health route at root.
7 - Create docker-compose with:
    - Postgres pre-configured
    - NodeJS
8 - Create class PostgresContext at `Infrastructure/Database/`
    - Configure startup method to call it.
    - Configure Prisma necessary code.
    - Set up Audit feeding for timestamps correcly.
    - Set up auto UUID generator upon record creation.
    - Set up Migrations path at `Infrastructure/Database/Migrations`.
    - Set up Seeding path at `Infrastructure/Database/Seeders`.
    - Set up Tenancy logic.
9 - Create the Interface IAuditBase in `/Domain/interfaces/` as follow:
    - id : UUID
    - created_at : DateTime
    - created_by : UUID
    - updated_at : DateTime
    - updated_by : UUID
    - deleted_at : DateTime
    - deleted_by : UUID
10 - Create interface IAudit in `Domain/interfaces` as follow:
    - Implement IAuditBase and it's properties

    - tenant_id : UUID
11 - Create entity User at `Domain/Users/` as follow:
    - Implement IAudit interface and it's properties

    - fullName : string
    - username : string
    - pasword : string
    - user_level : int | options: [1..10] | default: 1
12 - Create entity UserRole in `Domain/Users/` as follow:
    - id : UUID
    - user_id : UUID
    - role: string
    - is_allowed : boolean
13 - Create entity Business in `Domain/Business/` as follow:
    - Implement IAuditBase and it's properties

    - company_name : string
    - subscription : int

14 - Create Context for User at `Application/Controllers/` as follow:
    - Create a new controller for User.
    - Create a new repository for User.
    - Create a new validator for User.
    - Create a new user_create_dto.
    - Create a new user_update_dto.

    - Under user Controller, create all stated routes.
    - Under user Validator, create validation rules for it's properties.
    - Under user Repository, create all stated CRUD methods.
    - Under user's DTOs, create all necessary properties.
