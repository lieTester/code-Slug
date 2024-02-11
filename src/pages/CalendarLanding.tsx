// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
import CalendarSideBar from "@/components/calendarPageComponents/CalendarSidebar";
import CalendarBase from "@/components/calendarPageComponents/CalendarBase";
import CalendarWeeklyPlans from "@/components/calendarPageComponents/CalendarWeeklyPlans";

const CalenderLanding: FC<SessionProp> = ({ session }) => {
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;

   useEffect(() => {
      if (setSession) {
         setSession(session);
      }
   }, [session]);
   return (
      <>
         <section className="w-screen min-h-screen h-full pt-20 py-10  overflow-y-auto">
            <div className="w-[95%] h-full lg:w-[90%] 2xl:w-[80%] md:flex justify-between mx-auto font-baloo">
               <CalendarSideBar />
               {/* <CalendarBase /> */}
               <CalendarWeeklyPlans />
            </div>
         </section>
      </>
   );
};

export default CalenderLanding;
