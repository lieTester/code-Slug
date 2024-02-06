// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
import { ProblemsProvider } from "@/context/ProblemsContext";

// component
import Main from "@/components/_FirstPageComponents/Main";
import SideBar from "@/components/_FirstPageComponents/SideBar";
import { FiltersProvider } from "@/context/FiltersContext";

const Landing: FC<SessionProp> = ({ session }) => {
   // session store functionality below
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;
   useEffect(() => {
      if (setSession) {
         // console.log(session);
         setSession(session);
      }
   }, [session]);

   return (
      <section className="w-screen h-full py-20 flex flex-col overflow-y-auto">
         <ProblemsProvider>
            <FiltersProvider>
               <div className="w-[95%]  lg:w-[90%] 2xl:w-[80%] mx-auto  md:flex justify-between">
                  <SideBar />
                  <Main />
               </div>
            </FiltersProvider>
         </ProblemsProvider>
      </section>
   );
};

export default Landing;
