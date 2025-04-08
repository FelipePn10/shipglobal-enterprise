import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export async function GET() {
  const result = await db.select().from(users).limit(1);
  return Response.json(result);
}