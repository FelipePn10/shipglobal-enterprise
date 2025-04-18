import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import {
  companies,
  users,
  companyMembers,
  messages,
  imports,
  companyRelations,
  userRelations,
  companyMemberRelations,
  messageRelations,
  importRelations,
} from "./schema";

// Configuração do pool de conexões MySQL
const pool = createPool({
  host: process.env.DB_HOST || "mysql",
  port: Number(process.env.DB_PORT) || 3310,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "companydb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Verifica a conexão ao inicializar
pool
  .getConnection()
  .then((connection) => {
    console.log("Conexão com MySQL estabelecida com sucesso");
    connection.release();
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MySQL:", error);
  });

// Configuração do Drizzle ORM
export const db = drizzle(pool, {
  schema: {
    companies,
    users,
    companyMembers,
    messages,
    imports,
    companyRelations,
    userRelations,
    companyMemberRelations,
    messageRelations,
    importRelations,
  },
  mode: "default",
  logger: process.env.NODE_ENV === "development",
});