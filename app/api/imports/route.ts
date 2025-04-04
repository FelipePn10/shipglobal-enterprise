import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const importList = await db.select().from(imports);
  return NextResponse.json(importList);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { importId, companyId, title, status, origin, destination, eta, progress } = data;

  await db.insert(imports).values({
    importId,
    companyId,
    title,
    status,
    origin,
    destination,
    eta,
    progress,
  });

  // Fetch the newly inserted import
  const newImport = await db
    .select()
    .from(imports)
    .where(eq(imports.importId, importId))
    .limit(1);

  return NextResponse.json(newImport[0]);
}

export async function GET_BY_ID(request: Request, { params }: { params: { id: string } }) {
  const importData = await db
    .select()
    .from(imports)
    .where(eq(imports.importId, params.id))
    .limit(1);
  return NextResponse.json(importData[0] || null);
}