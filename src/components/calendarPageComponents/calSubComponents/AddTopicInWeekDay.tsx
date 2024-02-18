import { SessionContext } from "@/context/SessionContext";
import { getWeekDaysAndTopics } from "@/functions/CalendarFunctions";
import { getAllTopics } from "@/functions/TopicFunctions";
import { topicProp, viewCalendarDataProp } from "@/types";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import CalWeekBanner1 from "./CalWeekBanner1";
type AddTopicInWeekDay = {
   weekDaySettings: {
      day?: string;
      open: boolean;
      color?: string;
      banner?: number;
      hoverColor?: string;
   };
   setWeekDaySettings: React.Dispatch<
      SetStateAction<{
         day?: string;
         open: boolean;
         color?: string;
         banner?: number;
         hoverColor?: string;
      }>
   >;
   weekCalendarId: string;
};

const AddTopicInWeekDay: React.FC<AddTopicInWeekDay> = ({
   weekDaySettings,
   setWeekDaySettings,
   weekCalendarId,
}) => {
   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const [viewCalendarData, setViewCalendarData] =
      useState<viewCalendarDataProp | null>(null);
   const [topics, setTopics] = useState<topicProp[]>([]);

   const fetchCaledarIdData = async () => {
      await getWeekDaysAndTopics(session?.user?.id, weekCalendarId).then(
         (res) => {
            setViewCalendarData(res?.formattedWeekDays);
         }
      );
      const topicsRes = await getAllTopics();
      setTopics && setTopics(topicsRes.data.topics);
   };
   useEffect(() => {
      if (session?.user?.id && weekCalendarId) {
         fetchCaledarIdData();
      }
   }, [weekCalendarId]);

   return (
      <div
         className={`${
            weekDaySettings?.open ? "fixed" : "hidden"
         }   top-0 left-0 inset-0 flex items-center justify-center z-[100]  fade`}
      >
         <div
            onClick={() => setWeekDaySettings({ open: false })}
            className="absolute w-full h-full backdrop-blur-md backdrop-filter  "
         ></div>
         <span
            onClick={() => setWeekDaySettings({ open: false })}
            className="absolute top-[2vh] right-4 text-hard text-2xl font-sofiaPro font-extrabold"
         >
            X
         </span>
         <div
            className={`absolute md:relative   bottom-0 w-full z-[100]  mx-auto md:w-[50%] h-[calc(100%-7%)] md:h-[500px] p-4  md:rounded-md    backdrop-brightness-50 backdrop-blur-3xl`}
         >
            <div className="relative h-[30%] bg-transparent rounded-md font-sofiaPro flex justify-center items-center cursor-pointer  before:absolute before:w-full before:h-full before:bg-gray-300 before:bg-opacity-5 before:blur-xl group ">
               <span
                  className={`absolute inset-0 flex justify-center items-center text-9xl font-extrabold ${weekDaySettings?.color} opacity-30 transition-transform duration-300  group-hover:scale-0 group-hover:blur-sm`}
               >
                  {weekDaySettings?.day}
               </span>
               <span
                  className={`relative text-prim1 text-7xl  font-bold transition-transform duration-500 group-hover:text-8xl group-hover:scale-110 ${weekDaySettings?.hoverColor}`}
               >
                  {weekDaySettings?.day}
               </span>
            </div>
            <div className=" md:flex h-[70%]">
               <div className="w-full h-full md:w-[40%] py-1 ">
                  <span className="h-[40px] font-sofiaPro text-xl text-center block p-1 border-2 border-secod1 rounded-md">
                     Topics
                  </span>
                  <ul className="h-[calc(100%-50px)] flex flex-wrap justify-evenly mt-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-backg1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-front2">
                     {topics?.map((topic) => {
                        return (
                           <li
                              key={topic?.id}
                              className="px-2 mr-1 mb-2 rounded-md bg-white bg-opacity-10 text-sm text-prim2 cursor-pointer hover:bg-opacity-25 hover:text-prim1 transform transition-all "
                           >
                              {topic?.name}
                           </li>
                        );
                     })}
                  </ul>
               </div>
               <div className=" px-2 w-full md:w-[60%] ">
                  <ul>
                     <li></li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AddTopicInWeekDay;
