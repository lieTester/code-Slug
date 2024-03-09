"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { SessionProvider } from "@/context/SessionContext";
import CalendarLanding from "@/pages/CalendarLanding";
import CalendarLandingSkeleton from "@/components/skeleton/calenderlanding/CalendarLandingSkeleton";

export default function ListHome() {
   const { data: session } = useSession();
   // console.log(session);
   useEffect(() => {
      if (session === null) {
         redirect("/");
      }
   }, [session]);

   return (
      <main className="relative w-screen h-screen ">
         <SessionProvider>
            {!session ? (
               <CalendarLandingSkeleton />
            ) : (
               <CalendarLanding session={session} />
            )}
         </SessionProvider>
      </main>
   );
}
