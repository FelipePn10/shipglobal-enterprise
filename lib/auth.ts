import { NextAuthOptions, SessionStrategy, User, Account, Profile, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { companies, users } from "./schema";
import { eq } from "drizzle-orm";
import { getToken} from "next-auth/jwt";
import { NextRequest } from "next/server";

declare module "next-auth" {
  interface User {
    type?: "user" | "company";
    companyId?: string;
  }

  interface Session {
    user: {
      id: string;
      type?: "user" | "company";
      companyId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type?: "user" | "company";
    companyId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        const [company] = await db
          .select()
          .from(companies)
          .where(eq(companies.corporateEmail, credentials.email))
          .limit(1);

        const entity = user || company;
        if (!entity) return null;

        const isValid = await bcrypt.compare(credentials.password, entity.password);
        if (!isValid) return null;

        return {
          id: entity.id.toString(),
          name: user ? `${user.firstName} ${user.lastName}` : company.name,
          email: credentials.email,
          type: user ? 'user' : 'company',
          companyId: company?.id?.toString()
        } as User;
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
       secure: false
      },
    },
  },
  pages: {
    signIn: "/auth/login",
    error: '/auth/error'
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.type = token.type as 'user' | 'company';
      return session;
    }
  }
};

export async function verifyAuth(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
    
    if (!token?.id) return null;

    return {
      userId: token.id,
      companyId: token.type === "company" ? token.companyId : null
    };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}