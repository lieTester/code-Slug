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
   callbacks: {
      async signIn({ user, account, profile }) {
         try {
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
                  username: profile?.name,
                  email: profile?.email,
                  profile: profile?.picture,
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
         }
         return true;
      },
      // async jwt({ token, user, account, profile, isNewUser }) {
      //    console.log("called jwt");
      //    console.log(token, user, account, profile, isNewUser);
      //    if (account) {
      //       const userLoggedIn = await SignToken(user?.email as string);
      //       token.loggedUser = userLoggedIn;
      //    }
      //    return token;
      // },
      // async session({ session, token, user }) {
      //    session.loggedUser = token.loggedUser;
      //    return session;
      // },
   },
};
