import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ImportCollection } from "@/lib/mongo/collections/imports";

const IdSchema = z.string().min(1);

export async function GET(
  request: Request,
  context: unknown // Use unknown em vez de RouteParams
): Promise<NextResponse> {
  const { params } = context as { params: { id: string } }; // Asserção de tipo
  try {
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "ID de importação inválido", details: parsedId.error.flatten() },
        { status: 400 }
      );
    }

    const id = parsedId.data;

    const [mysqlImport, mongoImport] = await Promise.all([
      db
        .select()
        .from(imports)
        .where(eq(imports.importId, id))
        .limit(1),
      ImportCollection.findByImportId(id),
    ]);

    if (!mysqlImport.length && !mongoImport) {
      return NextResponse.json(
        { error: `Importação com ID ${id} não encontrada` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      mysql: mysqlImport[0] || null,
      mongo: mongoImport || null,
    });
  } catch (error) {
    console.error("Erro ao buscar importação por ID:", {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: unknown // Use unknown em vez de RouteParams
): Promise<NextResponse> {
  const { params } = context as { params: { id: string } }; // Asserção de tipo
  try {
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "ID de importação inválido", details: parsedId.error.flatten() },
        { status: 400 }
      );
    }

    const id = parsedId.data;

    const [mysqlImport, mongoImport] = await Promise.all([
      db
        .select()
        .from(imports)
        .where(eq(imports.importId, id))
        .limit(1),
      ImportCollection.findByImportId(id),
    ]);

    if (!mysqlImport.length && !mongoImport) {
      return NextResponse.json(
        { error: `Importação com ID ${id} não encontrada` },
        { status: 404 }
      );
    }

    await Promise.all([
      mysqlImport.length
        ? db.delete(imports).where(eq(imports.importId, id))
        : Promise.resolve(),
      mongoImport
        ? ImportCollection.deleteById(mongoImport._id.toString())
        : Promise.resolve(),
    ]);

    return NextResponse.json(
      { message: `Importação ${id} deletada com sucesso` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar importação por ID:", {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";