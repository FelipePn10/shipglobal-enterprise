import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

export const config = {
    api: {
      bodyParser: false,
      externalResolver: true,
    },
  };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
