
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import prisma from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true
    })
  ],
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
   
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
})
