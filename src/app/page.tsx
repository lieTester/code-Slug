"use client";

import { useSession } from "next-auth/react";

import Landing from "@/pages/Landing";

import { SessionProvider } from "../context/SessionContext";

export default function Home() {
   // session
   const { data: session } = useSession();
   // console.log(session);

   return (
      <main className="relative w-screen h-screen ">
         <SessionProvider>
            {session !== undefined && <Landing session={session} />}
         </SessionProvider>
      </main>
   );
}
