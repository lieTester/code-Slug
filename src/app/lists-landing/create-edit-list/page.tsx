"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import ListLandingSkeleton from "@/components/skeleton/listlanding/ListLandingSkeleton";

import { SessionProvider } from "@/context/SessionContext";
import { ProblemsProvider } from "@/context/ProblemsContext";
import ListMaker from "@/components/listPageComponents/ListMaker";

export default function ListHome() {
   const { data: session } = useSession();
   // console.log(session);
   useEffect(() => {
      if (session === null) {
         console.log("session is null");
         redirect("/");
      }
   }, [session]);

   return (
      <main className="relative w-screen h-screen ">
         <SessionProvider>
            {!session ? (
               <ListLandingSkeleton />
            ) : (
               <ProblemsProvider>
                  <ListMaker session={session} />
               </ProblemsProvider>
            )}
         </SessionProvider>
      </main>
   );
}
