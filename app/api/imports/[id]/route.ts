import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ImportCollection } from "@/lib/mongo/collections/imports";

const IdSchema = z.string().min(1);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Validate ID
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "Invalid import ID", details: parsedId.error.flatten() },
        { status: 400 }
      );
    }

    const id = parsedId.data;

    // Query both databases
    const [mysqlImport, mongoImport] = await Promise.all([
      db
        .select()
        .from(imports)
        .where(eq(imports.importId, id))
        .limit(1),
      ImportCollection.findByImportId(id)
    ]);

    if (!mysqlImport.length && !mongoImport) {
      return NextResponse.json(
        { error: `Import with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      mysql: mysqlImport[0] || null,
      mongo: mongoImport || null
    });
  } catch (error) {
    console.error("Error fetching import by ID:", {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "Invalid import ID", details: parsedId.error.flatten() },
        { status: 400 }
      );
    }

    const id = parsedId.data;

    // Check existence in both databases
    const [mysqlImport, mongoImport] = await Promise.all([
      db
        .select()
        .from(imports)
        .where(eq(imports.importId, id))
        .limit(1),
      ImportCollection.findByImportId(id)
    ]);

    if (!mysqlImport.length && !mongoImport) {
      return NextResponse.json(
        { error: `Import with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Delete from both databases
    await Promise.all([
      mysqlImport.length ? db.delete(imports).where(eq(imports.importId, id)) : Promise.resolve(),
      mongoImport ? ImportCollection.deleteById(mongoImport._id.toString()) : Promise.resolve()
    ]);

    return NextResponse.json(
      { message: `Import ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting import by ID:", {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";