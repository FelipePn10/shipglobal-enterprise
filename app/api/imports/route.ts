import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ImportCollection } from "@/lib/mongo/collections/imports";
import { z } from "zod";
import { CurrencyCode } from "@/lib/mongoModels";

const ImportSchema = z.object({
  title: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  status: z.enum(["draft", "pending", "processing", "completed", "failed"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  eta: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      currency: z.string().length(3),
    })
  ).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");
    const companyId = req.headers.get("company-id");

    // Development mode allows unauthenticated access
    if (process.env.NODE_ENV === "development" && !userId && !companyId) {
      const [mysqlImports, mongoImports] = await Promise.all([
        db.select().from(imports),
        ImportCollection.findByUserOrCompany()
      ]);
      return NextResponse.json({ mysql: mysqlImports, mongo: mongoImports });
    }

    if (!userId && !companyId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Query both databases
    const query = userId 
      ? eq(imports.userId, Number(userId))
      : eq(imports.companyId, Number(companyId));

    const [mysqlImports, mongoImports] = await Promise.all([
      db.select().from(imports).where(query),
      ImportCollection.findByUserOrCompany(
        userId ? Number(userId) : undefined,
        companyId ? Number(companyId) : undefined
      )
    ]);

    return NextResponse.json({
      mysql: mysqlImports,
      mongo: mongoImports
    });
  } catch (error) {
    console.error("Error fetching imports:", error);
    return NextResponse.json(
      { error: "Failed to fetch imports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");
    const companyId = req.headers.get("company-id");

    // Authorization check
    if (!userId && !companyId && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await req.json();
    const validation = ImportSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const validatedData = validation.data;
    const importId = `IMP-${Date.now()}`;

    // Create in MySQL
    const mysqlImport = {
      importId,
      title: validatedData.title,
      origin: validatedData.origin,
      destination: validatedData.destination,
      status: validatedData.status || "draft",
      progress: validatedData.progress || 0,
      eta: validatedData.eta || null,
      ...(userId ? { userId: Number(userId) } : {}),
      ...(companyId ? { companyId: Number(companyId) } : {}),
    };

    const [insertedImport] = await db.insert(imports)
      .values(mysqlImport)
      .$returningId();

    // Create in MongoDB
    const mongoImport = await ImportCollection.create({
      importId,
      userId: userId ? Number(userId) : undefined,
      companyId: companyId ? Number(companyId) : undefined,
      title: validatedData.title,
      status: validatedData.status || "draft",
      origin: validatedData.origin,
      destination: validatedData.destination,
      progress: validatedData.progress || 0,
      eta: validatedData.eta,
      items: validatedData.items?.map(item => ({
        ...item,
        sku: item.productId,
        currency: item.currency as CurrencyCode,
      })) || [],
      metadata: {
        mysqlImportId: insertedImport.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      mysql: {
        id: insertedImport.id,
        ...mysqlImport
      },
      mongo: mongoImport
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}