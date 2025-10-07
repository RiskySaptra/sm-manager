# Project Restructuring Plan

This document outlines the plan to refactor the project's folder structure for better scalability and maintainability.

## Current Structure Issues

- **Inconsistent Naming:** Presence of both `db` and `database` directories.
- **Scattered Core Logic:** The `core` directory mixes entities, guards, and interceptors. While related, they can be better organized.
- **Underutilized `common` Directory:** A good intention for shared code, but not fully utilized.
- **Centralized Entities:** All database entities are in `core/entities`, making it harder to manage feature modules independently. Entities should be co-located with the module they belong to.

## Proposed New Structure

The new structure will be more domain-driven, grouping files by feature and separating shared/cross-cutting concerns.

```
src/
├── app/
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── app.service.ts
├── database/
│   ├── migrations/
│   └── seeds/
│   └── data-source.ts
├── shared/
│   ├── decorators/
│   ├── enums/
│   ├── guards/
│   ├── interceptors/
│   └── utils/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts
│   │   └── dto/
│   ├── organizations/
│   │   ├── organizations.controller.ts
│   │   ├── organizations.module.ts
│   │   ├── organizations.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       ├── organization.entity.ts
│   │       └── organization-user.entity.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── stores/
│   │   ├── stores.controller.ts
│   │   ├── stores.module.ts
│   │   ├── stores.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── store.entity.ts
│   ├── roles/
│   │   ├── roles.controller.ts
│   │   ├── roles.module.ts
│   │   ├── roles.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │       ├── role.entity.ts
│   │       └── access-right.entity.ts
│   └── audit-log/
│       ├── audit-log.module.ts
│       ├── audit-log.service.ts
│       └── entities/
│           └── audit-log.entity.ts
└── main.ts
```

## Refactoring Steps

1.  **Create New Directories:** Create the new folder structure (`app`, `database`, `shared`, `modules/*`).
2.  **Move Files:** Move existing files to their new locations.
    - `src/app.*.ts` -> `src/app/`
    - `src/db/migrations` -> `src/database/migrations`
    - `src/db/seed.ts` -> `src/database/seeds/seed.ts`
    - `data-source.ts` -> `src/database/data-source.ts`
    - `src/core/guards` & `src/core/interceptors` -> `src/shared/`
    - Feature modules (`auth`, `organizations`, etc.) -> `src/modules/`
    - Entities from `src/core/entities` -> `src/modules/{feature}/entities/`
3.  **Update Imports:** Go through every moved file and update all relative import paths to reflect the new structure. This is the most critical step.
4.  **Update Configuration:**
    - Check `nest-cli.json` and `tsconfig.json` for any paths that need updating.
    - Update TypeORM config in `data-source.ts` to point to the new entity locations.
5.  **Cleanup:** Remove all old, now-empty directories (`core`, `db`, `common`, etc.).

This refactoring will result in a cleaner, more organized, and developer-friendly codebase.