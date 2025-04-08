import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { connect } from "@planetscale/database";
import type { MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import { companies, users, messages, imports } from "./schema";

type Schema = {
  companies: typeof companies;
  users: typeof users;
  messages: typeof messages;
  imports: typeof imports;
};

const isEdge = typeof process === "undefined" || !!process.env?.VERCEL_ENV;

const createConnection = () => {
  if (isEdge) {
    return connect({
      host: process.env.DB_HOST,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      fetch: (url, init) => {
        delete (init as any)["cache"];
        return fetch(url, init);
      }
    });
  }
  
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

export const db = drizzle<Schema>(
  createConnection() as any,
  {
    schema: { companies, users, messages, imports },
    mode: "default"
  } as MySql2DrizzleConfig<Schema>
);