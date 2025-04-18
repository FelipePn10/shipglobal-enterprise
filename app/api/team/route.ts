import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, companyMembers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const data = await request.json();
  const { firstName, lastName, email, role, companyId } = data;

  try {
    // 1. Primeiro cria o usuário (SEM companyId)
    const hashedPassword = await bcrypt.hash("default_password", 10);
    const [newUser] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    }).$returningId();

    // 2. Se foi fornecido companyId, cria a associação em company_members
    if (companyId) {
      await db.insert(companyMembers).values({
        userId: newUser.id,
        companyId,
        role: "member", // Ou role adequado
      });
    }

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}