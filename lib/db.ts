import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { companies, users, messages, imports } from "./schema";

const pool = mysql.createPool({
  host: "hero-mysql",
  port:  3306,
  user: "root",
  password: "admin",
  database: "companydb",
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