// app/api/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);