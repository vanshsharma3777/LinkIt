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

  // Simplified cookie config that works in production
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  pages: {
    signIn: "/signin",
  },
})