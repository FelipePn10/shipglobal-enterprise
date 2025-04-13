import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      companyId = 1, // Default or fetched from context
      role = "purchase_manager", // Default role
      stripeAccountId, // Optional
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      companyId: parseInt(companyId),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      stripeAccountId: stripeAccountId || null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("User Registration Error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}