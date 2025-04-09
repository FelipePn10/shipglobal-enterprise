// lib/auth.ts
import { type NextAuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { companies, users } from "./schema";
import { eq } from "drizzle-orm";
import { type JWT } from "next-auth/jwt";

// Definimos nosso tipo customizado para o usuário
export interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  type: "user" | "company"; // Sempre obrigatório
  companyId?: string;
}

// Estendemos os tipos do NextAuth para incluir nossas propriedades customizadas
declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
  interface User extends CustomUser {} // Extendemos User para ser compatível com CustomUser
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "user" | "company"; // Consistente com CustomUser
    companyId?: string;
    email?: string | null; // Adicionado para compatibilidade
    name?: string | null; // Adicionado para compatibilidade
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Busca usuário
          const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          // Busca empresa se não encontrar usuário
          const companyResult =
            userResult.length === 0
              ? await db
                  .select()
                  .from(companies)
                  .where(eq(companies.corporateEmail, credentials.email))
                  .limit(1)
              : [];

          const entity = userResult[0] || companyResult[0];
          if (!entity) return null;

          const isValid = await bcrypt.compare(credentials.password, entity.password);
          if (!isValid) return null;

          return {
            id: entity.id.toString(),
            name: userResult[0]
              ? `${userResult[0].firstName} ${userResult[0].lastName}`
              : companyResult[0]?.name,
            email: credentials.email,
            type: userResult[0] ? "user" : "company",
            companyId: companyResult[0]?.id?.toString(),
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.companyId = user.companyId;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          type: token.type,
          companyId: token.companyId,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
};