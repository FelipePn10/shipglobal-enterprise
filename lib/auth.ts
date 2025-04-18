import { User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { companies, users, companyMembers } from "./schema";
import { eq } from "drizzle-orm";

export interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  type: "user" | "company";
  companyId?: string | null; // Pode ser null para usuários sem empresa
  stripeAccountId?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
  interface User extends CustomUser {
    _type: "next-auth-user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "user" | "company";
    companyId?: string | null;
    email?: string | null;
    name?: string | null;
    stripeAccountId?: string | null;
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Login para desenvolvedores no ambiente de desenvolvimento
          if (
            process.env.NODE_ENV === 'development' &&
            credentials.email === 'dev@example.com' &&
            credentials.password === 'devbypass'
          ) {
            return {
              id: 'dev-user-123',
              name: 'Developer User',
              email: 'dev@example.com',
              type: 'user',
              companyId: null,
              stripeAccountId: null,
              _type: 'next-auth-user',
            };
          }

          // Autenticação para usuários
          const userResult = await db
            .select({
              id: users.id,
              firstName: users.firstName,
              lastName: users.lastName,
              email: users.email,
              password: users.password,
              stripeAccountId: users.stripeAccountId,
            })
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          // Busca a empresa associada ao usuário (se existir)
          let userCompanyId: string | null = null;
          if (userResult.length > 0) {
            const companyResult = await db
              .select({ companyId: companyMembers.companyId })
              .from(companyMembers)
              .where(eq(companyMembers.userId, userResult[0].id))
              .limit(1);

            userCompanyId = companyResult[0]?.companyId?.toString() || null;
          }

          // Autenticação para empresas
          const companyResult =
            userResult.length === 0
              ? await db
                  .select({
                    id: companies.id,
                    name: companies.name,
                    corporateEmail: companies.corporateEmail,
                    password: companies.password,
                  })
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
            companyId: userResult[0] ? userCompanyId : companyResult[0]?.id?.toString(),
            stripeAccountId: userResult[0]?.stripeAccountId,
            _type: "next-auth-user",
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
        token.stripeAccountId = user.stripeAccountId;
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
          stripeAccountId: token.stripeAccountId,
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
    maxAge: 30 * 24 * 60 * 60,
  },
};