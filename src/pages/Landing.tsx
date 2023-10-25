// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
// component
import Header from "@/components/Header";
import Main from "@/components/Main";
import SideBar from "@/components/SideBar";

const Landing: FC<SessionProp> = ({ session }) => {
   // session store functionality below
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;
   useEffect(() => {
      if (session && setSession) {
         setSession(session);
      }
   }, [session]);

   return (
      <section className="w-screen h-screen flex flex-col overflow-y-auto">
         <Header />
         <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] mx-auto h-fit mt-10 flex justify-between">
            <SideBar />
            <Main />
         </div>
      </section>
   );
};

export default Landing;
