import { mysqlTable, int, varchar, boolean, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm"; 

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