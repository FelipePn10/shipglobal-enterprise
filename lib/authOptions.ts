import { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { companies } from "./schema";
import { eq } from "drizzle-orm";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  secret: "Q9KEKLq3PdpPZ1f7kb4bqN80UI/hI3aft8kWEIR9X4E=",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Corporate Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [company] = await db
          .select()
          .from(companies)
          .where(eq(companies.corporateEmail, credentials.email))
          .limit(1);

        if (!company || company.status !== "approved") return null;

        const isValid = await bcrypt.compare(credentials.password, company.password);
        if (!isValid) return null;

        return {
          id: company.id.toString(),
          name: `${company.adminFirstName} ${company.adminLastName}`,
          email: company.corporateEmail,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    },
  },
};
