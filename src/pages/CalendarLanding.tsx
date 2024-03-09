// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
// components
import CalendarSideBar from "@/components/calendarPageComponents/CalendarSidebar";
import CalendarBase from "@/components/calendarPageComponents/CalendarBase";
import CalendarWeeklyPlans from "@/components/calendarPageComponents/CalendarWeeklyPlans";
import { useSearchParams } from "next/navigation";
import useQueryParams from "@/hook/useQueryParams";

const CalenderLanding: FC<SessionProp> = ({ session }) => {
   // session context
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;

   const searchParams = useSearchParams();

   const [viewNavigation, setViewNavigation] = useState<string>("base");
   useEffect(() => {
      if (setSession) {
         setSession(session);
      }
   }, [session]);
   const getMainNav = () => {
      switch (viewNavigation) {
         case "weekly-plan":
            return <CalendarWeeklyPlans />;
         default:
            return <CalendarBase />;
      }
   };
   useEffect(() => {
      setViewNavigation(searchParams?.get("block") || "");
   }, [searchParams?.get("block")]);

   return (
      <>
         <section className="w-screen min-h-screen h-full pt-20 py-10  overflow-y-auto">
            <div className="w-[95%] h-full lg:w-[90%] 2xl:w-[80%] md:flex justify-between mx-auto font-baloo">
               <CalendarSideBar />
               {getMainNav()}
            </div>
         </section>
      </>
   );
};

export default CalenderLanding;
