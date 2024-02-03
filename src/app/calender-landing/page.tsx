"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { SessionProvider } from "@/context/SessionContext";
import CalendarLanding from "@/pages/CalendarLanding";

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
            {session && <CalendarLanding session={session} />}
         </SessionProvider>
      </main>
   );
}
