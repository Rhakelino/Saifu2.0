# Saifu Backend & D1 Schema Specification

## Stack Backend Terpisah
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM (`drizzle-orm/d1`)
- **Auth**: Better Auth (`provider: "sqlite"`)

---

## 1. D1 SQLite Schema (`schema.js` / `schema.ts`)

```javascript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// =====================
// Better Auth Tables
// =====================

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// =====================
// App Tables
// =====================

export const wallets = sqliteTable("wallets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'bank', 'ewallet', 'cash'
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  walletId: text("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  toWalletId: text("to_wallet_id")
    .references(() => wallets.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'income', 'expense', 'transfer'
  category: text("category").default("Lainnya"),
  amount: integer("amount").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});
```

---

## 2. API Endpoints Contract

### Auth Endpoints
- `ALL /api/auth/*` -> Handled by Better Auth Cloudflare Worker Adapter.

### Wallets (`/api/wallets`)
- `GET /api/wallets` -> List wallet + balance.
- `POST /api/wallets` -> Body: `{ name, type }`.
- `PUT /api/wallets/:id` -> Body: `{ name, type }`.
- `DELETE /api/wallets/:id` -> Delete wallet.

### Transactions (`/api/transactions`)
- `GET /api/transactions?walletId=xxx` -> List transactions (ordered `createdAt DESC`).
- `POST /api/transactions` -> Body: `{ walletId, type, category, amount, description }`.
- `POST /api/transactions/transfer` -> Body: `{ fromWalletId, toWalletId, amount, description }`.
- `PUT /api/transactions/:id` -> Body: `{ amount, category, description }`.
- `DELETE /api/transactions/:id` -> Delete transaction.

---

## 3. Worker Config (`wrangler.jsonc`)

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "saifu-backend",
  "main": "src/index.ts",
  "compatibility_date": "2024-09-23",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "saifu-db",
      "database_id": "<YOUR_D1_DATABASE_ID>"
    }
  ]
}
```
