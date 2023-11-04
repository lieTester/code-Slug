// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
// component
import Header from "@/components/Header";
import ListMaker from "@/components/ListMaker";
import ProblemFilters from "@/components/subcomponent/Filter/ProblemFilters";
import { ProblemsProvider } from "@/context/ProblemsContext";

const ListsLanding: FC<SessionProp> = ({ session }) => {
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;
   useEffect(() => {
      if (setSession) {
         // console.log(session);
         setSession(session);
      }
   }, [session]);
   return (
      <section className="w-screen h-screen flex flex-col overflow-y-auto">
         <Header />
         <ProblemsProvider>
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] mx-auto h-fit pt-20 pb-32 font-baloo ">
               <ProblemFilters />
               <ListMaker />
            </div>
         </ProblemsProvider>
      </section>
   );
};

export default ListsLanding;
