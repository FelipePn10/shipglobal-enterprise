import { db } from "@/lib/db";
import { users } from "@/lib/schema";


await db.insert(users).values({
  email: 'test@example.com',
  password: 'hashed_password',
  companyId: 1,
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
}).onDuplicateKeyUpdate({
  set: {
    email: 'test@example.com',
    updatedAt: new Date(),
  },
});
