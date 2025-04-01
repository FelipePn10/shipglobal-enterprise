import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { companies, users, messages } from "./schema";

const pool = mysql.createPool({
  host: "mysql",
  port: 3306,
  user: "root",
  password: "admin",
  database: "companydb",
});

export const db = drizzle(pool, { schema: { companies, users, messages }, mode: "default" });