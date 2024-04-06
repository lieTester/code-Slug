import React, { useEffect, useState } from "react";
import { CalFullViewProps, viewCalendarDataProp } from "@/types";
import {
   assignCalendarToUser,
   getWeekDaysAndTopics,
} from "@/functions/CalendarFunctions";
import { DotLoader } from "@/components/commonComponents/Loaders";

const CalFullViewComponent: React.FC<CalFullViewProps> = ({
   weekCalendarName,
   weekCalendarId,
   userId,
   color,
   hoverColor,
}) => {
   // view weekCalendar details of selected calendar
   const [viewCalendarData, setViewCalendarData] =
      useState<viewCalendarDataProp | null>(null);
   const [viewCalendarDataLoader, setViewCalendarDataLoader] =
      useState<boolean>(true);
   const [sendingData, setSendingData] = useState<boolean>(false);
   const days: string[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
   ];
   const displayCalendarDetails = async () => {
      setViewCalendarDataLoader(true);
      await getWeekDaysAndTopics({
         userId: userId,
         weekCalendarId: weekCalendarId,
      }).then((res) => {
         setViewCalendarData(res?.formattedWeekDays);
         setViewCalendarDataLoader(false);
      });
   };
   const assignIdToUser = async () => {
      setSendingData(true);
      assignCalendarToUser({
         userId: userId,
         weekCalendarId: weekCalendarId,
      }).then((res) => {
         console.log(res.status);
         if (res.status === 200) {
            setSendingData(false);
         }
      });
   };
   useEffect(() => {
      displayCalendarDetails();
   }, []);

   return (
      <div className="relative max-h-[500px] bg-transparent rounded-md z-[10] before:z-[-1] before:absolute before:w-full before:h-full before:bg-gray-300 before:bg-opacity-5 before:blur-xl border-[2px] border-bordr1 group overflow-hidden">
         <div className="relative h-[100px] capitalize font-sofiaPro flex justify-center items-center overflow-hidden  cursor-default">
            <span
               className={`absolute truncate inset-0 flex justify-center items-center text-7xl font-extrabold ${color} opacity-30 transition-transform duration-300  group-hover:scale-0 group-hover:blur-sm`}
            >
               {weekCalendarName}
            </span>
            <span
               className={`relative text-5xl  font-bold transition-transform duration-500 group-hover:text-6xl group-hover:scale-110 ${hoverColor} `}
            >
               {weekCalendarName}
            </span>
            <button
               title={`Apply calendar ${weekCalendarName}`}
               onClick={() => {
                  !sendingData && assignIdToUser();
               }}
               className="absolute h-5 top-2 right-2 text-base bg-secod1 px-3 py-1 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-75"
            >
               {sendingData ? <DotLoader /> : "Apply"}
            </button>
         </div>
         <div className="w-full min-h-[100px] max-h-[400px]  p-3   overflow-y-auto ">
            {viewCalendarDataLoader ? (
               <div className="w-full h-[200px] md:min-h-[calc(100%-100px)] flex justify-center items-center  ">
                  <DotLoader />
               </div>
            ) : (
               <div className="w-full h-full columns-2 space-y-3 ">
                  {viewCalendarData &&
                     days?.map(
                        (day) =>
                           viewCalendarData[day]?.topics?.length !== 0 && (
                              <div
                                 key={viewCalendarData[day].id}
                                 className="h-full break-inside-avoid "
                              >
                                 <span
                                    className={`w-full inline-block text-center py-1 mb-1  rounded-md text-prim2 backdrop-brightness-[.6] `}
                                 >
                                    {day}
                                 </span>
                                 <ul className="w-full flex  flex-wrap p-2 border-[2px] border-bordr1 rounded-md  [&>*]:m-1 ">
                                    {viewCalendarData[day]?.topics.map(
                                       (topic) => {
                                          return (
                                             <li
                                                key={topic?.id}
                                                title={topic?.name}
                                                className={` flex items-center justify-between rounded-full text-[12px] bg-secod3 text-prim2 hover:text-prim1 cursor-default px-2 truncate`}
                                             >
                                                {topic?.name}
                                             </li>
                                          );
                                       }
                                    )}
                                 </ul>
                              </div>
                           )
                     )}
               </div>
            )}
         </div>
      </div>
   );
};

export default CalFullViewComponent;
