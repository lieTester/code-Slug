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
import CalendarApplyWeeklyPlan from "@/components/calendarPageComponents/CalendarApplyWeeklyPlan";

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
         case "create-edit-weekly-plans":
            return <CalendarWeeklyPlans />;
         case "apply-weekly-plan":
            return <CalendarApplyWeeklyPlan />;
         default:
            return <CalendarBase />;
      }
   };
   useEffect(() => {
      setViewNavigation(searchParams?.get("block") || "");
   }, [searchParams?.get("block")]);

   return (
      <>
         <section className="w-screen h-full pt-20 pb-10  overflow-y-auto ">
            <div className="w-[95%] h-full lg:w-[90%] 2xl:w-[80%] md:flex justify-between mx-auto font-baloo ">
               <CalendarSideBar />
               <div className="w-full pb-4 md:pl-4  md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-sofiaPro text-prim1 ">
                  {getMainNav()}
               </div>
            </div>
         </section>
      </>
   );
};

export default CalenderLanding;
