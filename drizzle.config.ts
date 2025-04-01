import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./lib/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "admin",
    database: "companydb",
  },
  verbose: true,
});