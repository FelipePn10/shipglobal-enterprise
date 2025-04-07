import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { companies, users, messages, imports } from "./schema";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "companydb",
});

export const db = drizzle(pool, { schema: { companies, users, messages, imports }, mode: "default" });

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    connection.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
})();