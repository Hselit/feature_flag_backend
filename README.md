# Byepo

Express + TypeScript API with Prisma (MySQL), JWT auth, and organization-scoped users and feature flags.

## Prerequisites

- Node.js (compatible with your lockfile)
- MySQL instance and a database URL

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your connection string:

   ```bash
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

3. Apply migrations and generate the Prisma client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. Start the server (default port **3000**):

   ```bash
   npm run dev
   ```

On startup, role seed data runs before the HTTP server listens.

---

## Database tables (screenshots)

Save one screenshot per model under `docs/screenshots/` using these names (or change the paths in the image links below):

| Model           | Filename                    |
|-----------------|-----------------------------|
| `Organization`  | `organization-table.png`  |
| `Role`          | `role-table.png`          |
| `User`          | `user-table.png`          |
| `FeatureFlag`   | `feature-flag-table.png`  |

**How to capture:** use Prisma Studio (`npx prisma studio`), MySQL Workbench, or another client, open each table, and export or screenshot the result grid.

### Organization

![Organization table](Images/Screenshot 2026-05-07 at 12.04.18 AM.png)

### Role

![Role table](Images/Screenshot 2026-05-07 at 12.04.07 AM.png)

### User

![User table](Images/Screenshot 2026-05-07 at 12.03.46 AM.png)

### FeatureFlag

![FeatureFlag table](Images/Screenshot 2026-05-07 at 12.04.31 AM.png)

---

## Table relationships

All foreign keys are enforced in Prisma against MySQL.

### Summary

- **Organization** is the tenant: it owns many **Users** and many **FeatureFlags**.
- **Role** is a lookup for user roles: many **Users** point to one **Role**.
- **User** belongs to exactly one **Organization** and one **Role**.
- **FeatureFlag** belongs to exactly one **Organization**; flag **keys** are unique per organization (not globally).

### Entity–relationship view

  Organization {
    int id PK
    string name
    datetime createdAt
    datetime updatedAt
  }

  Role {
    int id PK
    string name UK
    boolean isActive
    datetime createdAt
    datetime updatedAt
  }

  User {
    int id PK
    string email UK
    string password
    int roleId FK
    int organizationId FK
    datetime createdAt
    datetime updatedAt
  }

  FeatureFlag {
    int id PK
    string key
    boolean isEnabled
    int organizationId FK
    datetime createdAt
    datetime updatedAt
  }
```

### Cardinality (plain language)

| From            | Relationship | To             | Notes |
|-----------------|--------------|----------------|-------|
| Organization    | **1 → N**    | User           | `User.organizationId` → `Organization.id` |
| Organization    | **1 → N**    | FeatureFlag    | `FeatureFlag.organizationId` → `Organization.id` |
| Role            | **1 → N**    | User           | `User.roleId` → `Role.id` |
| FeatureFlag     | **N → 1**    | Organization   | Composite uniqueness on `(key, organizationId)` so the same key can exist for different organizations |

---

## HTTP surface (high level)

Routes are mounted in `src/app.ts`, for example:

- `/auth` — signup, login, public role list, authenticated user routes
- `/organizations` — organization APIs (as implemented)
- `/feature-flags` — CRUD and check endpoints scoped by organization from the JWT

Refer to the route files under `src/**/routes/` for exact paths and methods.
