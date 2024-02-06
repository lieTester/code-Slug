// react, next
import { FC, useEffect, useContext, useState } from "react";
// component
import ListSideBar from "@/components/listPageComponents/ListSideBar";
// context
import { SessionContext } from "@/context/SessionContext";
import { ProblemsProvider } from "@/context/ProblemsContext";
// types
import { SessionProp } from "@/types/index";
import ListMaker from "@/components/listPageComponents/ListMaker";

const ListsLanding: FC<SessionProp> = ({ session }) => {
   // session store functionality below
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;
   useEffect(() => {
      if (setSession) {
         setSession(session);
      }
   }, [session]);

   return (
      <section className="w-screen h-full pt-20 py-10 flex flex-col overflow-y-auto ">
         <ProblemsProvider>
            <div className="w-[95%] h-full lg:w-[90%] 2xl:w-[80%] mx-auto  flex justify-between ">
               <ListSideBar />
               <ListMaker />
            </div>
         </ProblemsProvider>
      </section>
   );
};

export default ListsLanding;
