// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
// component
import Header from "@/components/Header";

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
      </section>
   );
};

export default ListsLanding;
