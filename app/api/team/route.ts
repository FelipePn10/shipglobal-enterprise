// import { NextRequest, NextResponse } from "next/server";
// import { eq, and } from "drizzle-orm";
// import { db } from "@/lib/db";
// import { users } from "@/lib/schema";


// export async function GET(req: NextRequest) {
//   try {
//     const teamMembers = await db.select().from(users).where(
//       and(
//         eq(users.role, "purchase_manager"),
//         eq(users.role, "admin")
//       )
//     );
//     return NextResponse.json({ success: true, data: teamMembers }, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
//     return NextResponse.json(
//       { error: "Falha ao buscar equipe", details: errorMessage },
//       { status: 500 }
//     );
//   }
// }