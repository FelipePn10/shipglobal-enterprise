import { db } from '../lib/db';
import { users } from '../lib/schema';
import * as bcrypt from 'bcryptjs'; // Importação alternativa

async function seed() {
  const password = await bcrypt.hash('testpassword', 10);
  await db.insert(users).values({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password,
    role: 'user',
  });

  console.log('Usuário criado!');
}

seed().catch(console.error);