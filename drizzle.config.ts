import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT) || 3310,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'companydb',
  },
  verbose: true,
  strict: true,
});