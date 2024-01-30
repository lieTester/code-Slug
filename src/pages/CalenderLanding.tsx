// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";

const CalenderLanding: FC<SessionProp> = ({ session }) => {
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;

   useEffect(() => {
      if (setSession) {
         // console.log(session);
         setSession(session);
      }
   }, [session]);
   return (
      <>
         <section className="w-screen min-h-screen h-full py-20  overflow-y-auto">
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%]  mx-auto font-baloo "></div>
         </section>
      </>
   );
};

export default CalenderLanding;
