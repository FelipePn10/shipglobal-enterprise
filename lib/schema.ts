import { mysqlTable, int, varchar, boolean, datetime, text } from "drizzle-orm/mysql-core";
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
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  hasPurchaseManager: boolean("hasPurchaseManager").default(false).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
});

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companies.id).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // "admin" or "purchase_manager"
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  senderId: int("sender_id").references(() => users.id).notNull(),
  receiverId: int("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
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
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastUpdated: datetime("last_updated").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const importRelations = relations(imports, ({ one }) => ({
  user: one(users, { fields: [imports.userId], references: [users.id] })
}))
