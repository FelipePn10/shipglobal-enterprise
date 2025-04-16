import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imports } from "@/lib/schema";
import { eq } from "drizzle-orm";

import { ImportOrder } from "@/lib/mongoModels";
import { z } from "zod";
import clientPromise from "@/lib/mongo";

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

    // Connect to MongoDB
    const mongoClient = await clientPromise;
    const mongoDb = mongoClient.db();
    const importsCollection = mongoDb.collection<ImportOrder>("imports");

    // Em desenvolvimento, permite buscar sem autenticação
    if (process.env.NODE_ENV === "development" && !userId && !companyId) {
      const [mysqlImports, mongoImports] = await Promise.all([
        db.select().from(imports),
        importsCollection.find().toArray()
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
      importsCollection.find({
        ...(userId ? { userId: Number(userId) } : {}),
        companyId: companyId ? Number(companyId) : undefined
      }).toArray()
    ]);

    return NextResponse.json({
      mysql: mysqlImports,
      mongo: mongoImports
    });
  } catch (error) {
    console.error("Error fetching imports:", error);
    return NextResponse.json({ error: "Failed to fetch imports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");
    const companyId = req.headers.get("company-id");

    // Validação básica
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

    // Connect to MongoDB
    const mongoClient = await clientPromise;
    const mongoDb = mongoClient.db();
    const importsCollection = mongoDb.collection<ImportOrder>("imports");

    // Criar no MySQL
    const mysqlImport = {
      importId,
      title: validatedData.title,
      origin: validatedData.origin,
      destination: validatedData.destination,
      status: validatedData.status || "draft",
      progress: validatedData.progress || 0,
      eta: validatedData.eta || undefined,
      ...(userId ? { userId: Number(userId) } : {}),
      ...(companyId ? { companyId: Number(companyId) } : {}),
    };

    const [insertedImport] = await db.insert(imports)
      .values(mysqlImport)
      .$returningId();

    // Criar no MongoDB
    const mongoImport: ImportOrder = {
      importId,
      userId: userId ? Number(userId) : 0,
      companyId: companyId ? Number(companyId) : 0,
      title: validatedData.title,
      status: validatedData.status || "draft",
      origin: validatedData.origin,
      destination: validatedData.destination,
      progress: validatedData.progress || 0,
      eta: validatedData.eta || undefined,
      items: validatedData.items || [],
      metadata: {
        mysqlImportId: insertedImport.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mongoResult = await importsCollection.insertOne(mongoImport);

    return NextResponse.json({
      mysql: insertedImport,
      mongo: {
        id: mongoResult.insertedId,
        ...mongoImport
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}