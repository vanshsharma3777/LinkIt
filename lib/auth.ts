import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { prisma } from "../lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions:AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({  
      clientId:process.env.GOOGLE_CLIENT_ID||"",
      clientSecret:process.env.GOOGLE_SECRET_ID||""
    })
  ],
  secret:process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
     jwt: async ({ token,user })=>{
      if (user){
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token
    },
    async session({ session,token }: any) {
      if (token?.userId) {
        session.user.id = token.userId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  }
};