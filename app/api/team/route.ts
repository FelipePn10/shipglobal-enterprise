import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const teamMembers = await db.select().from(users);
  return NextResponse.json(teamMembers);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { firstName, lastName, email, role, companyId } = data;

  await db.insert(users).values({
    firstName,
    lastName,
    email,
    role,
    companyId,
    password: "default_password", // In a real app, hash this
  });

  const newMember = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return NextResponse.json(newMember[0]);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...updates } = data;

  await db.update(users).set(updates).where(eq(users.id, id));

  // Fetch the updated member
  const updatedMember = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return NextResponse.json(updatedMember[0]);
}