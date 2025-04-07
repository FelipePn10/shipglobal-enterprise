import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const importList = await db.select().from(imports);
    return NextResponse.json(importList);
  } catch (error) {
    console.error("Error fetching imports:", error);
    return NextResponse.json({ error: "Failed to fetch imports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { importId, companyId, title, status, origin, destination, eta, progress } = data;

    // Validação básica
    if (!importId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(imports).values({
      importId,
      companyId: companyId || 1, // Valor padrão se não fornecido
      title,
      status: status || "pending",
      origin: origin || "Unknown",
      destination: destination || "Unknown",
      eta: eta || "TBD",
      progress: progress || 0,
    });

    const newImport = await db
      .select()
      .from(imports)
      .where(eq(imports.importId, importId))
      .limit(1);

    if (!newImport.length) {
      return NextResponse.json({ error: "Failed to retrieve new import" }, { status: 500 });
    }

    return NextResponse.json(newImport[0], { status: 201 });
  } catch (error) {
    console.error("Error creating import:", error);
    return NextResponse.json({ error: "Failed to create import" }, { status: 500 });
  }
}