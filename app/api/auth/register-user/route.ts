import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users, companies } from "@/lib/schema";
import { z } from "zod";

// Define TypeScript interface for type safety
interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "purchase_manager" | "admin";
  companyId?: number;
  stripeAccountId?: string | null;
}

// Zod schema for validation
const registerSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  role: z.enum(["purchase_manager", "admin"]).default("purchase_manager"),
  companyId: z.number().int().positive("ID da empresa inválido").optional(),
  stripeAccountId: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request data
    const data = await req.json();
    const parsedData = registerSchema.safeParse(data);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, role, companyId, stripeAccountId } =
      parsedData.data;

    // Validate companyId if provided
    if (companyId) {
      const companyExists = await db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.id, companyId))
        .limit(1);

      if (companyExists.length === 0) {
        return NextResponse.json(
          { error: "Empresa não encontrada" },
          { status: 400 }
        );
      }
    }

    // Check for existing user
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email já registrado" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.insert(users).values({
      companyId: companyId || null, // Set to null if not provided
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      stripeAccountId: stripeAccountId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Usuário registrado com sucesso" }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);

    // Handle specific MySQL errors
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { error: "Empresa especificada não existe" },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Falha ao registrar usuário", details: errorMessage },
      { status: 500 }
    );
  }
}