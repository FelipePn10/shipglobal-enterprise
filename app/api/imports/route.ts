import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('user-id');
    const companyId = request.headers.get('company-id');

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = companyId 
      ? and(eq(imports.userId, Number(userId)), eq(imports.companyId, Number(companyId)))
      : eq(imports.userId, Number(userId));

    const userImports = await db
      .select()
      .from(imports)
      .where(query);

    return NextResponse.json(userImports);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch imports" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const userId = request.headers.get("user-id");
    const companyId = request.headers.get("company-id");
    
    // Validação de autenticação
    if (!userId && !companyId) {
      return NextResponse.json(
        { error: "Acesso não autorizado" }, 
        { status: 401 }
      );
    }

    // Não permitir ambos IDs
    if (userId && companyId) {
      return NextResponse.json(
        { error: "Use apenas user-id ou company-id" }, 
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validação de campos obrigatórios
    const requiredFields = ['title', 'origin', 'destination'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const importData = {
      importId: `IMP-${Date.now()}`,
      title: data.title,
      origin: data.origin,
      destination: data.destination,
      status: data.status || 'draft',
      progress: data.progress || 0,
      eta: data.eta || null,
      ...(userId 
        ? { userId: parseInt(userId) } 
        : { companyId: parseInt(companyId!) }
      )
    };

    const newImport = await db.insert(imports).values(importData);

    return NextResponse.json(newImport, { status: 201 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}