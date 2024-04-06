import React, { useContext, useEffect, useState } from "react";
import { TbRefresh } from "react-icons/tb";
// component
import { DotLoader } from "@/components/commonComponents/Loaders";
//function
import { getAllUserAndPublicCalendars } from "@/functions/CalendarFunctions";
//session
import { SessionContext } from "@/context/SessionContext";

//types
import { calendarsProp } from "@/types/index";
import CalFullViewComponent from "./calSubComponents/CalFullViewComponent";

const CalendarApplyWeeklyPlan: React.FC = () => {
   // session context //////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // calendar states //////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////
   // all calendar of user plus default details
   const [calendars, setCalendars] = useState<calendarsProp[]>();
   const [calendarsLoader, setCalendarsLoader] = useState<boolean>(true);

   const weekDaysSettings: {
      color: string;
      hoverColor: string;
   }[] = [
      {
         color: "text-red-500",
         hoverColor: "group-hover:text-red-300",
      },
      {
         color: "text-amber-500",
         hoverColor: "group-hover:text-amber-300",
      },
      {
         color: "text-pink-200",
         hoverColor: "group-hover:text-pink-200",
      },
      {
         color: "text-lime-500",
         hoverColor: "group-hover:text-lime-300",
      },
      {
         color: "text-green-800",
         hoverColor: "group-hover:text-green-400",
      },
      {
         color: "text-blue-800",
         hoverColor: "group-hover:text-blue-800",
      },
      {
         color: "text-yellow-700",
         hoverColor: "group-hover:text-yellow-300",
      },
      {
         color: "text-teal-500",
         hoverColor: "group-hover:text-teal-300",
      },
   ];

   // calendar functions //////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   const fetchData = async () => {
      setCalendarsLoader(true);
      await getAllUserAndPublicCalendars({ userId: session?.user?.id })
         .then((res) => {
            // console.log(res);
            setCalendars(res?.formattedCalendars);
         })
         .then((res) => {
            setCalendarsLoader(false);
         });
   };

   useEffect(() => {
      fetchData();
   }, []);
   return (
      <>
         <div className="relative h-[100px] flex justify-center items-center cursor-default overflow-hidden  bg-transparent rounded-md z-[10] before:z-[-1] before:absolute before:w-full before:h-full before:bg-gray-300 before:bg-opacity-5 before:blur-xl border-[2px] border-bordr1 group">
            <span
               className={`relative text-5xl  font-bold transition-transform duration-500 group-hover:text-6xl group-hover:scale-110 `}
            >
               Calendars
            </span>
            <div className="absolute top-2 right-2 flex justify-between items-center">
               <button
                  title="Refresh Calendars"
                  onClick={() => fetchData()}
                  className="relative overflow-hidden p-2 rounded-full flex justify-center items-center text-xl backdrop-brightness-[.6] hover:scale-110 transition-transform duration-75"
               >
                  <TbRefresh />
               </button>
            </div>
         </div>
         {calendarsLoader ? (
            <div className="w-full h-[200px] md:min-h-[calc(100%-100px)] flex justify-center items-center  ">
               <DotLoader />
            </div>
         ) : (
            <div
               className={` w-full min-h-[calc(100%-100px)] py-5 columns-1 sm:columns-2 md:columns-1 lg:columns-2 3xl:columns-3  space-y-4 overflow-hidden [&>*]:break-inside-avoid [&>*]:overflow-hidden `}
            >
               {session?.user?.id &&
                  calendars?.map((calendar, index) => {
                     return (
                        <CalFullViewComponent
                           key={index}
                           userId={session?.user?.id}
                           color={
                              weekDaysSettings[index % weekDaysSettings.length]
                                 .color
                           }
                           hoverColor={
                              weekDaysSettings[index % weekDaysSettings.length]
                                 .hoverColor
                           }
                           weekCalendarId={calendar?.id}
                           weekCalendarName={calendar?.title}
                        />
                     );
                  })}
            </div>
         )}
      </>
   );
};

export default CalendarApplyWeeklyPlan;
