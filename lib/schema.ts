import { mysqlTable, int, varchar, boolean, datetime, text, decimal, index, timestamp, bigint } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

export const companies = mysqlTable("companies", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 14 }).notNull().unique(),
  corporateEmail: varchar("corporateEmail", { length: 255 }).notNull().unique(),
  industry: varchar("industry", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  number: varchar("number", { length: 50 }).notNull(),
  adminFirstName: varchar("adminFirstName", { length: 255 }).notNull(),
  adminLastName: varchar("adminLastName", { length: 255 }).notNull(),
  adminPhone: varchar("adminPhone", { length: 20 }).notNull(),
  companyPhone: varchar("companyPhone", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: datetime("createdAt", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updatedAt", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  hasPurchaseManager: boolean("hasPurchaseManager").default(false).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
});

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companies.id), // Removido notNull
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  stripeAccountId: varchar("stripe_account_id", { length: 50 }),
  createdAt: datetime("createdAt", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updatedAt", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const balances = mysqlTable(
  "balances",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: int("user_id").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull().default("0.00"),
    lastUpdated: timestamp("last_updated", { mode: 'date' }).notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userCurrencyIdx: index("user_currency_idx").on(table.userId, table.currency),
  })
);

export const transactions = mysqlTable(
  "transactions",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: int("user_id").notNull(),
    type: varchar("type", { length: 20 }).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    date: timestamp("date", { mode: 'date' }).notNull().defaultNow(),
    status: varchar("status", { length: 20 }).notNull(),
    description: text("description"),
    paymentIntentId: varchar("payment_intent_id", { length: 255 }),
    targetCurrency: varchar("target_currency", { length: 3 }),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
    dateIdx: index("date_idx").on(table.date),
  })
);

export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  senderId: int("sender_id").references(() => users.id).notNull(),
  receiverId: int("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: datetime("createdAt", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const imports = mysqlTable("imports", {
  id: int("id").primaryKey().autoincrement(),
  importId: varchar("import_id", { length: 50 }).notNull().unique(),
  userId: int("user_id").references(() => users.id),
  companyId: int("company_id").references(() => companies.id),
  title: varchar("title", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  progress: int("progress").notNull().default(0),
  eta: varchar("eta", { length: 50 }),
  createdAt: datetime("created_at", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastUpdated: datetime("last_updated", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const exchangeRates = mysqlTable("exchange_rates", {
  id: int("id").primaryKey().autoincrement(),
  baseCurrency: varchar("base_currency", { length: 10 }).notNull(),
  rates: text("rates").notNull(),
  updatedAt: datetime("updated_at", { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Relations
export const companyRelations = relations(companies, ({ many }) => ({
  users: many(users),
  imports: many(imports),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  imports: many(imports),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receiver" }),
}));

export const importRelations = relations(imports, ({ one }) => ({
  user: one(users, { fields: [imports.userId], references: [users.id] }),
  company: one(companies, { fields: [imports.companyId], references: [companies.id] }),
}));

export const exchangeRateRelations = relations(exchangeRates, () => ({}));