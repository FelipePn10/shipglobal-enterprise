import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "../../../../../lib/db";
import { companies } from "../../../../../lib/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    await db.insert(companies).values({
      name: data.companyName,
      cnpj: data.cnpj,
      corporateEmail: data.corporateEmail,
      adminFirstName: data.adminFirstName,
      adminLastName: data.adminLastName,
      industry: data.industry,
      country: data.country,
      state: data.state,
      city: data.city,
      street: data.street,
      number: data.number,
      adminPhone: data.adminPhone,
      companyPhone: data.companyPhone,
      password: hashedPassword,
      hasPurchaseManager: data.hasPurchaseManager,
      status: data.hasPurchaseManager ? "pending" : "approved",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao registrar empresa" }, { status: 500 });
  }
}