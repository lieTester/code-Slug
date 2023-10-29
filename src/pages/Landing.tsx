// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
import { ProblemsProvider } from "@/context/ProblemsContext";

// component
import Header from "@/components/Header";
import Main from "@/components/Main";
import SideBar from "@/components/SideBar";

const Landing: FC<SessionProp> = ({ session }) => {
   // session store functionality below
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;
   useEffect(() => {
      if (setSession) {
         setSession(session);
      }
   }, [session]);

   return (
      <section className="w-screen h-screen flex flex-col overflow-y-auto">
         <ProblemsProvider>
            <Header />
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] mx-auto h-fit pt-20 pb-32 flex justify-between">
               <SideBar />
               <Main />
            </div>
         </ProblemsProvider>
      </section>
   );
};

export default Landing;
