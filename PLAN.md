# SaaS Multi-Organization Project Plan (Detailed)

This document provides a detailed, phased development plan for the SaaS multi-organization application. It serves as a technical guide for implementation.

---

## Phase 1: Core Setup & Foundation

**Objective:** Establish the project's technical foundation, including dependencies, database connectivity, and the core data model.

- **1.1: Install and Configure Dependencies**
  - **Packages:** Install core NestJS dependencies plus TypeORM, PostgreSQL driver, and Swagger.
    ```bash
    pnpm add @nestjs/typeorm typeorm pg @nestjs/config
    pnpm add @nestjs/swagger swagger-ui-express
    ```
  - **Configuration:** Use `@nestjs/config` to manage environment variables (`.env` file) for database credentials, JWT secrets, and other sensitive data.

- **1.2: Establish Database Connection**
  - **Module:** Configure the `TypeOrmModule` in `app.module.ts` using `forRootAsync` to dynamically load database credentials from the `ConfigService`.
  - **Connection:** Ensure the application can successfully connect to the PostgreSQL database.

- **1.3: Implement Database Entities & ENUMs**
  - **Directory Structure:** Create a `src/core/entities` directory for all TypeORM entities and `src/core/enums` for custom PostgreSQL ENUM types.
  - **Implementation:** Define each entity (`User`, `Organization`, `Store`, etc.) as a TypeScript class with TypeORM decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`, `@ManyToOne`, `@OneToMany`). Precisely map all relationships as defined in the ER diagram.

- **1.4: Generate and Run Initial Migration**
  - **CLI Configuration:** Configure the TypeORM CLI to connect to the database and locate entities.
  - **Migration Generation:** Use the command `typeorm migration:generate -n InitialSchema` to create a migration file based on the defined entities.
  - **Migration Execution:** Run the migration with `typeorm migration:run` to create the full database schema.

---

## Phase 2: Authentication & User Management

**Objective:** Implement a secure authentication system and provide basic user management capabilities.

- **2.1: Implement Authentication Module**
  - **Packages:** Install Passport.js and JWT libraries.
    ```bash
    pnpm add @nestjs/passport passport @nestjs/jwt passport-jwt bcrypt
    pnpm add -D @types/passport-jwt @types/bcrypt
    ```
  - **Structure:** Create an `AuthModule` containing:
    - `AuthController`: Exposes `/register` and `/login` endpoints.
    - `AuthService`: Handles business logic, including password hashing with `bcrypt` and signing JWTs.
    - `JwtStrategy`: A Passport strategy to validate JWTs on protected requests.

- **2.2: Create Secure User Endpoints**
  - **Module:** Create a `UsersModule`.
  - **Controller:** Implement a `UsersController` with an endpoint like `GET /me` protected by the `JwtAuthGuard`. This endpoint will return the profile of the currently authenticated user.

---

## Phase 3: Organization & Multi-Tenancy

**Objective:** Build the core multi-tenant logic, allowing users to belong to and manage organizations.

- **3.1: Implement Organizations Module**
  - **Structure:** Create an `OrganizationsModule` with a controller, service, and entity.
  - **Endpoints:** Implement full CRUD endpoints for managing organizations (`POST /organizations`, `GET /organizations/:id`, etc.).

- **3.2: Implement User Invitation Logic**
  - **Functionality:** Create an endpoint (`POST /organizations/:id/users`) to associate an existing user with an organization by creating an `OrganizationUser` record. This will assign them a role within that organization.

- **3.3: Develop a Tenancy Guard**
  - **Goal:** Ensure strict data isolation between organizations.
  - **Implementation:** Create a custom NestJS `Guard` that inspects the user's JWT to identify their active `organizationId`. This guard will be used to scope all subsequent data access. Service methods will be refactored to always require an `organizationId` in their queries.

---

## Phase 4: Store Management

**Objective:** Allow organization users to manage stores within their organizational context.

- **4.1: Implement Stores Module**
  - **Structure:** Create a `StoresModule` with a controller and service.
  - **Scoped Access:** Protect all endpoints in the `StoresController` with the `TenancyGuard`. The `StoresService` will ensure that all database operations (create, read, update, delete) are filtered by the `organizationId` from the user's session.

---

## Phase 5: Role-Based Access Control (RBAC)

**Objective:** Implement a flexible permission system to control user actions within the application.

- **5.1: Implement Roles & Permissions Modules**
  - **Structure:** Create a `RolesModule` to manage `Role` and `AccessRight` entities.
  - **Endpoints:** Provide endpoints for creating roles and assigning specific permissions (e.g., `canWrite` on the `INVENTORY` module) to them.

- **5.2: Develop an Authorization Guard**
  - **Implementation:** Create a custom `RolesGuard`. This guard will check the user's role (via `OrganizationUser`) and verify their `AccessRights` against the required permissions for a specific endpoint. This can be paired with a custom decorator like `@RequirePermission('INVENTORY', 'WRITE')`.

---

## Phase 6: Auditing

**Objective:** Create a comprehensive audit trail for important actions within the system.

- **6.1: Implement AuditLog Module**
  - **Structure:** Create an `AuditLogModule` with an `AuditLogService`. The service will provide a method to create new log entries.

- **6.2: Create a Global Auditing Interceptor**
  - **Implementation:** Develop a NestJS `Interceptor` that can be applied globally. It will automatically capture key request data (user, action, target, IP address) and use the `AuditLogService` to persist the audit log after the request is completed.

---

## Phase 7: Finalization & Documentation

**Objective:** Prepare the application for use with seed data and comprehensive documentation.

- **7.1: Create Database Seed Script**
  - **Implementation:** Use a custom NestJS provider or a TypeORM seed script to populate the database with essential initial data, such as a superadmin user and default roles ('Admin', 'Manager').

- **7.2: Generate API Documentation**
  - **Implementation:** Decorate all controllers, DTOs, and endpoints with `@nestjs/swagger` decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`). This will generate a complete and interactive OpenAPI (Swagger) specification.

- **7.3: Write Project Documentation**
  - **Content:** Create a final `DOCUMENTATION.md` file that explains the overall architecture, setup instructions, API usage, and key design decisions, with references to official documentation where appropriate.