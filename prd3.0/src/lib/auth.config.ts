import { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";

export const authConfig: NextAuthConfig = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/zh/auth/signin",
    verifyRequest: "/zh/auth/verify-request",
  },
  callbacks: {
    async signIn({ user }) {
      // 登录时自动创建/更新用户
      if (user.email) {
        const { createUser } = await import("@/lib/db");
        createUser({
          id: user.id || crypto.randomUUID(),
          name: user.name || undefined,
          email: user.email,
          image: user.image || undefined,
        });
      }
      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
  },
};
