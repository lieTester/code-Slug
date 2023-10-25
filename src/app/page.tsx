"use client";

import { useSession } from "next-auth/react";

import Landing from "@/pages/Landing";

import { SessionProvider } from "../context/SessionContext";

export default function Home() {
   // session
   const { data: session } = useSession();
   // console.log(session);

   return (
      <main className="relative w-screen h-screen after:absolute after:inset-0 after after:bg-prim1  before:absolute before:right-0 before:top-10 before:inset-72  before:rounded-[90%] before:opacity-70 before:blur-[60px] before:bg-prim2 before:-z-10 after:-z-20">
         <SessionProvider>
            {session !== undefined && <Landing session={session} />}
         </SessionProvider>
      </main>
   );
}
