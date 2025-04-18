import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise'; // Importação nomeada
import {
  companies,
  users,
  messages,
  imports,
  companyRelations,
  userRelations,
  messageRelations,
  importRelations,
} from './schema';

const pool = createPool({
  host: process.env.DB_HOST || 'localhost', // Usar 'localhost' para o host
  port: Number(process.env.DB_PORT) || 3310, // Porta mapeada no docker-compose
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'companydb',
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
  mode: 'default',
});