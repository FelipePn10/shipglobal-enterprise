// app/api/imports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");
    const companyId = req.headers.get("company-id");

    // Em desenvolvimento, permite buscar sem autenticação
    if (process.env.NODE_ENV === "development" && !userId && !companyId) {
      const allImports = await db.select().from(imports);
      return NextResponse.json(allImports);
    }

    if (!userId && !companyId) {
      return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
    }

    const query = userId
      ? eq(imports.userId, Number(userId))
      : eq(imports.companyId, Number(companyId));

    const userImports = await db.select().from(imports).where(query);

    return NextResponse.json(userImports);
  } catch (error) {
    console.error("Error fetching imports:", error);
    return NextResponse.json({ error: "Failed to fetch imports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");
    const companyId = req.headers.get("company-id");

    // Em desenvolvimento, usa valores mock se headers estiverem ausentes
    const effectiveUserId = process.env.NODE_ENV === "development" && !userId && !companyId ? "1" : userId;
    const effectiveCompanyId = process.env.NODE_ENV === "development" && !userId && !companyId ? null : companyId;

    if (!effectiveUserId && !effectiveCompanyId) {
      return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
    }

    if (effectiveUserId && effectiveCompanyId) {
      return NextResponse.json({ error: "Use apenas user-id ou company-id" }, { status: 400 });
    }

    const data = await req.json();

    const requiredFields = ["title", "origin", "destination"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const numericUserId = effectiveUserId ? Number(effectiveUserId) : null;
    const numericCompanyId = effectiveCompanyId ? Number(effectiveCompanyId) : null;
    const importId = `IMP-${Date.now()}`; // ID único baseado no timestamp

    const importData = {
      importId,
      title: data.title,
      origin: data.origin,
      destination: data.destination,
      status: data.status || "draft",
      progress: data.progress || 0,
      eta: data.eta || null,
      ...(numericUserId ? { userId: numericUserId } : {}),
      ...(numericCompanyId ? { companyId: numericCompanyId } : {}),
    };

    // Inserimos os dados no banco
    await db.insert(imports).values(importData).execute();

    // Buscamos o registro inserido para retornar
    const [newImport] = await db
      .select()
      .from(imports)
      .where(eq(imports.importId, importId))
      .limit(1);

    if (!newImport) {
      throw new Error("Falha ao recuperar a importação recém-criada");
    }

    return NextResponse.json(newImport, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}