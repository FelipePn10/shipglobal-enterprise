import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ dbUrl: process.env.DATABASE_URL });
}