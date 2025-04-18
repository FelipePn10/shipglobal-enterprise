import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/schema";
import { z } from "zod";

// Esquema de validação com Zod
const registerSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  role: z.enum(["purchase_manager", "admin"]).default("purchase_manager"),
  stripeAccountId: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse e validação dos dados
    const data = await req.json();
    const parsedData = registerSchema.safeParse(data);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, role, stripeAccountId } =
      parsedData.data;

    // Verifica se o email já existe
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email já registrado" }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserção do usuário
    await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      stripeAccountId: stripeAccountId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Falha ao registrar usuário", details: errorMessage },
      { status: 500 }
    );
  }
}