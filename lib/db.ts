import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  companies,
  users,
  messages,
  imports,
  companyRelations,
  userRelations,
  messageRelations,
  importRelations,
} from "./schema";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export const db = drizzle(pool, {
  schema: {
    companies,
    users,
    messages,
    imports,
    companyRelations,
    userRelations,
    messageRelations,
    importRelations,
  },
  mode: "default",
});
