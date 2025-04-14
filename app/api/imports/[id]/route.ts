import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Define the schema for the import data response
const ImportSchema = z.object({
  importId: z.string().uuid(),
  fileName: z.string().min(1),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  totalRecords: z.number().int().nonnegative(),
  processedRecords: z.number().int().nonnegative(),
  errorMessage: z.string().nullable(),
});

// Input validation schema for the ID
const IdSchema = z.string().uuid("Invalid import ID format");

// GET handler to fetch import details by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Validate the ID
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json(
        {
          error: "Invalid import ID",
          details: parsedId.error.flatten().formErrors,
        },
        { status: 400 }
      );
    }

    const id = Number(parsedId.data);

    // Query the database with explicit field selection
    const importData = await db
      .select({
        importId: imports.id,
        // fileName: imports.file_name,
        status: imports.status,
        // createdAt: imports.created_at,
        // updatedAt: imports.updated_at,
        // totalRecords: imports.total_records,
        // processedRecords: imports.processed_records,
        // errorMessage: imports.error_message,
      })
      .from(imports)
      .where(eq(imports.id, id))
      .limit(1);

    // Check if data exists
    if (importData.length === 0) {
      return NextResponse.json(
        { error: `Import with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Validate and transform the data
    const validatedData = ImportSchema.safeParse(importData[0]);
    if (!validatedData.success) {
      console.error("Data validation failed:", validatedData.error);
      return NextResponse.json(
        { error: "Invalid data format from database" },
        { status: 500 }
      );
    }

    // Return the validated data
    return NextResponse.json(validatedData.data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching import by ID:", {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error && error.message.includes("database")) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove an import by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Validate the ID
    const parsedId = IdSchema.safeParse(params.id);
    if (!parsedId.success) {
      return NextResponse.json(
        {
          error: "Invalid import ID",
          details: parsedId.error.flatten().formErrors,
        },
        { status: 400 }
      );
    }

    const id = Number(parsedId.data);

    // Check if import exists first
    const existingImport = await db
      .select()
      .from(imports)
      .where(eq(imports.id, id))
      .limit(1);

    if (existingImport.length === 0) {
      return NextResponse.json(
        { error: `Import with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Attempt to delete the import
    await db.delete(imports).where(eq(imports.id, id)).execute();

    return NextResponse.json(
      { message: `Import ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting import by ID:", {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";