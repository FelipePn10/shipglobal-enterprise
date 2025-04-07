import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const importData = await db
      .select()
      .from(imports)
      .where(eq(imports.importId, id))
      .limit(1);

    if (!importData.length) {
      return NextResponse.json({ error: "Import not found" }, { status: 404 });
    }

    return NextResponse.json(importData[0]);
  } catch (error) {
    console.error("Error fetching import by ID:", error);
    return NextResponse.json({ error: "Failed to fetch import" }, { status: 500 });
  }
}