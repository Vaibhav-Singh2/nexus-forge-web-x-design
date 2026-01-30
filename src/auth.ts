import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }, // Optional for this MVP
        role: { label: "Role", type: "text" }, // We might pass role from login form or infer it
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;

        if (!email) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          // For MVP, if user doesn't exist, we could auto-create or fail?
          // Let's fail for now as we seeded users.
          // Or auto-create to be friendly?
          // Let's stick to seeded users for strict testing.
          // Actually, let's allow "Guest" access creation or just fail.
          // Failing is safer for "Admin" testing.
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // We need to expose role in session
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Safe cast to allow adding properties
        const user = session.user as {
          id?: string;
          role?: string;
          email?: string | null;
          name?: string | null;
        };
        user.id = token.sub as string;
        user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
