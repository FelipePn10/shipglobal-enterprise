import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { companies } from "./schema";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "companydb",
});

export const db = drizzle(pool, { schema: { companies }, mode: "default" });