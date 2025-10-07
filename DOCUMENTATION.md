# SM Manager API Documentation

This document provides a comprehensive overview of the SM Manager API, including its architecture, setup instructions, and API usage.

## 1. Architecture

The SM Manager API is a multi-tenant SaaS application built with NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses a PostgreSQL database with TypeORM as the ORM.

The architecture is designed to be modular and scalable, with each feature area encapsulated in its own module. The core modules include:

-   **`AuthModule`**: Handles user authentication and JWT management.
-   **`CoreModule`**: Manages the database entities and provides a central point for entity registration.
-   **`OrganizationsModule`**: Manages organizations and their users.
-   **`StoresModule`**: Manages stores within an organization.
-   **`RolesModule`**: Manages user roles and permissions.
-   **`AuditLogModule`**: Provides a service for logging key actions across the application.

## 2. Setup Instructions

### 2.1. Prerequisites

-   Node.js (v16 or higher)
-   pnpm
-   PostgreSQL

### 2.2. Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Install the dependencies:

    ```bash
    pnpm install
    ```

3.  Create a `.env` file in the root of the project and add the following environment variables:

    ```bash
    # PostgreSQL Database Connection
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_DATABASE=sm_manager

    # Application Port
    PORT=3000

    # JWT
    JWT_SECRET=your-secret-key
    ```

4.  Run the database migrations:

    ```bash
    pnpm run migration:run
    ```

5.  Seed the database with initial data:

    ```bash
    pnpm run db:seed
    ```

6.  Start the development server:

    ```bash
    pnpm run start:dev
    ```

## 3. API Usage

The API is documented using Swagger. To access the Swagger UI, start the development server and navigate to `http://localhost:3000/api`.

### 3.1. Authentication

To access protected endpoints, you must first obtain a JWT by either registering a new user or logging in with an existing user.

-   **`POST /api/v1/auth/register`**: Register a new user.
-   **`POST /api/v1/auth/login`**: Log in with an existing user.

Once you have obtained a JWT, you must include it in the `Authorization` header of all subsequent requests as a bearer token:

```
Authorization: Bearer <your-jwt>
```

### 3.2. Key Decisions

-   **Multi-Tenancy**: The application uses a single-database, multi-tenancy approach, with each organization's data isolated by a `organizationId` column. A custom `TenancyGuard` is used to ensure that users can only access data within their own organization.
-   **Role-Based Access Control (RBAC)**: The application uses a flexible RBAC system that allows for granular control over user permissions. A custom `RolesGuard` is used to protect endpoints based on user roles and permissions.
-   **Auditing**: The application uses a custom `AuditInterceptor` to automatically log key actions across the application. This provides a comprehensive audit trail for all important events.

## 4. Guards

The application uses a set of custom guards to protect endpoints and enforce authorization rules.

### 4.1. `AuthGuard`

The `AuthGuard` is a standard NestJS guard that uses the `passport-jwt` strategy to protect endpoints. It ensures that only authenticated users can access the endpoint.

**Usage:**

```typescript
@UseGuards(AuthGuard())
```

### 4.2. `TenancyGuard`

The `TenancyGuard` ensures that users can only access data within their own organization. It inspects the user's JWT to identify their active `organizationId` and scopes all subsequent data access.

**Usage:**

```typescript
@UseGuards(AuthGuard(), TenancyGuard)
```

### 4.3. `RolesGuard`

The `RolesGuard` is used to protect endpoints based on user roles and permissions. It works in conjunction with the `@RequirePermission` decorator to specify the required permissions for a specific endpoint.

**Usage:**

```typescript
@UseGuards(AuthGuard(), RolesGuard)
@RequirePermission(AccessModule.INVENTORY, 'read')
```

### 4.4. `SuperAdminGuard`

The `SuperAdminGuard` restricts access to super admin-only endpoints. It checks if the authenticated user has the `isSuperAdmin` flag set to `true`.

**Usage:**

```typescript
@UseGuards(AuthGuard(), SuperAdminGuard)
```