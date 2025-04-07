import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const importData = await db
    .select()
    .from(imports)
    .where(eq(imports.importId, id))
    .limit(1);

  return NextResponse.json(importData[0] || null);
}
