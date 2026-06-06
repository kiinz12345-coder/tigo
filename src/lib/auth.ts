import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    Facebook({ clientId: process.env.FACEBOOK_CLIENT_ID!, clientSecret: process.env.FACEBOOK_CLIENT_SECRET! }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        const user = await db.user.findUnique({
          where: { id: token.sub },
          select: { id: true, credits: true, role: true, gender: true, earnings: true },
        });
        session.user.id = token.sub;
        session.user.credits = user?.credits || 0;
        session.user.role = user?.role || "USER";
        session.user.gender = user?.gender || null;
        session.user.earnings = user?.earnings || 0;
      }
      return session;
    },
  },
});
