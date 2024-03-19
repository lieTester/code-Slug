import React, { useContext, useEffect, useState } from "react";
import { FaDisplay } from "react-icons/fa6";
import { MdAddChart, MdDeleteOutline } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";
// component
import CalWeekBanner1 from "@/components/calendarPageComponents/calSubComponents/CalWeekBanner1";
import CalWeekBanner2 from "@/components/calendarPageComponents/calSubComponents/CalWeekBanner2";
import AddTopicInWeekDay from "@/components/calendarPageComponents/calSubComponents/AddTopicInWeekDay";
import { DotLoader } from "@/components/commonComponents/Loaders";
//function
import {
   createWeekCalendar,
   deleteWeekCalendar,
   getAllUserCalendars,
   getWeekDaysAndTopics,
} from "@/functions/CalendarFunctions";
//session
import { SessionContext } from "@/context/SessionContext";

//types
import { calendarsProp, viewCalendarDataProp } from "@/types/index";
import AllUserCalendarSkeleton from "../skeleton/calenderlanding/CalendarWeeklyPlans/AllUserCalendarSkeleton";

const CalendarApplyWeeklyPlan: React.FC = () => {
   // session context //////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // calendar states //////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////
   // all calendar of user plus default details
   const [calendars, setCalendars] = useState<calendarsProp[]>();
   const [calendarsLoader, setCalendarsLoader] = useState<boolean>(true);
   return (
      <section className="w-full  md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1  rounded-lg">
         <div className={`w-full h-full  py-4 bg-red-400`}></div>
      </section>
   );
};

export default CalendarApplyWeeklyPlan;
