"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import ListsLanding from "@/pages/ListsLanding";
import { ListLandingSkeleton } from "@/pages/skeleton/ListLanding.skeleton";

import { SessionProvider } from "@/context/SessionContext";
import { ProblemsProvider } from "@/context/ProblemsContext";

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
                  <ListsLanding session={session} />
               </ProblemsProvider>
            )}
         </SessionProvider>
      </main>
   );
}
