import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { AuthCredType } from "@/types/index";
import axios from "axios";

export const options: NextAuthOptions = {
   providers: [
      GithubProvider(<AuthCredType>{
         clientId: process.env.GITHUB_ID,
         clientSecret: process.env.GITHUB_SECRET,
      }),
      GoogleProvider(<AuthCredType>{
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
   ],
   session: {
      strategy: "jwt",
   },
   secret: process.env.NEXTAUTH_SECRET,
   callbacks: {
      async signIn({ user, account, profile }) {
         try {
            console.log("signIn:", user);
            const response = await axios.post(
               process.env.NEXT_PUBLIC_API_BASE_URL + "auth/user",
               {
                  email: profile?.email,
               }
            );
            if (response && response.data.value) {
               // console.log(user, account, profile, response.data.value);
               return true;
            } else {
               const data = {
                  username: user?.name,
                  email: user?.email,
                  profile: user?.image,
               };
               const response = await axios.post(
                  process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/user/signup",
                  data
               );
               if (response) return true;
               return false;
            }
         } catch (error) {
            console.error(
               "error: ---------------------------------------------------",
               error
            );
            return false;
         }
      },
      async jwt({ token, user, account, profile }) {
         console.log("called jwt");
         // console.log(token, user, account, profile);
         return token;
      },
      async session({ session, token, user }) {
         // console.log("session:", session, user, token);
         const response = await axios.post(
            process.env.NEXT_PUBLIC_API_BASE_URL + "auth/user",
            {
               email: session?.user?.email,
            }
         );
         if (response?.data && session?.user) {
            session.user.id = response.data.id;
         }
         return session;
      },
   },
};
