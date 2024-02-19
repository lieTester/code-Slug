import React, { SetStateAction, useContext, useEffect, useState } from "react";
// contexts
import { SessionContext } from "@/context/SessionContext";
// functions
import { getAllTopics } from "@/functions/TopicFunctions";
// types
import type { topicProp, AddTopicInWeekDay } from "@/types";
import { weekDayIdTopics } from "@/functions/CalendarFunctions";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";

const AddTopicInWeekDay: React.FC<AddTopicInWeekDay> = ({
   weekDaySettings,
   setWeekDaySettings,
   weekCalendarId,
}) => {
   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const [topics, setTopics] = useState<topicProp[]>([]);
   const [linkedTopics, setLinkedTopics] = useState<topicProp[]>([]);
   const [newLinkedTopics, setNewLinkedTopics] = useState<{
      [key: string]: boolean;
   }>({});

   const fetchInitialTopics = async () => {
      const topicsRes = await getAllTopics();
      setTopics && setTopics(topicsRes.data.topics);
   };
   const fetchLinkedTopics = async () => {
      if (weekDaySettings?.dayId) {
         const linkedTopicsRes = await weekDayIdTopics(
            session?.user?.id,
            weekDaySettings?.dayId
         );
         setLinkedTopics && setLinkedTopics(linkedTopicsRes.topics);
      }
   };
   useEffect(() => {
      if (session?.user?.id) {
         fetchInitialTopics();
      }
      if (session?.user?.id && weekDaySettings?.dayId) {
         fetchLinkedTopics();
         setNewLinkedTopics({});
      }
   }, [session?.user?.id, weekDaySettings?.dayId]);

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
            className={`absolute md:relative   bottom-0 w-full z-[100]  mx-auto md:w-[50%] h-[calc(100%-7%)] md:h-[500px] p-4  md:rounded-md    backdrop-brightness-[.4] backdrop-blur-3xl`}
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
                  <ul className="max-h-[calc(100%-50px)] flex flex-wrap justify-evenly mt-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-backg1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-front2">
                     {topics?.map((topic: topicProp) => {
                        return (
                           <li
                              key={topic?.id}
                              onClick={() => {
                                 setNewLinkedTopics((prev) => {
                                    return { ...prev, [topic?.id]: true }; // Dynamically assign index as key
                                 });
                              }}
                              className={`px-1 mr-1 mb-2 rounded-md ${
                                 newLinkedTopics[topic?.id]
                                    ? " bg-opacity-25 text-prim1 "
                                    : "text-prim2 "
                              } flex bg-white bg-opacity-10 text-sm  cursor-pointer hover:bg-opacity-25 hover:text-prim1 transform transition-all `}
                           >
                              {topic?.name}
                              {newLinkedTopics[topic?.id] && (
                                 <BsCheck2Circle className="text-easy mt-[2px] ml-1" />
                              )}
                           </li>
                        );
                     })}
                  </ul>
               </div>
               <div className=" px-2 w-full h-full md:w-[60%] py-1 ">
                  <span className="h-[40px] font-sofiaPro text-xl text-right block p-1 ">
                     Assigned Topics:
                  </span>
                  <ul className="max-h-[calc(100%-50px)] flex flex-wrap justify-evenly mt-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-backg1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-front2">
                     {linkedTopics?.map((topic) => {
                        return (
                           <li
                              key={topic?.id}
                              className={`flex mr-1 mb-2  h-fit rounded-sm text-[13px] bg-secod3 px-1 `}
                           >
                              {topic?.name}

                              <AiOutlineCloseCircle
                                 className="mt-[2px] ml-1 text-prim2 cursor-pointer hover:text-hard "
                                 onClick={() => {}}
                              />
                           </li>
                        );
                     })}
                     {topics?.map((topic: topicProp) => {
                        if (newLinkedTopics[topic?.id]) {
                           return (
                              <li
                                 key={topic?.id}
                                 className={` flex mr-1 mb-2  h-fit rounded-sm text-[13px] bg-secod1 px-1`}
                              >
                                 {topic?.name}

                                 <AiOutlineCloseCircle
                                    className="mt-[3px] ml-1 text-prim2 cursor-pointer hover:text-hard "
                                    onClick={() => {
                                       setNewLinkedTopics((prev) => {
                                          return {
                                             ...prev,
                                             [topic?.id]: false,
                                          }; // Dynamically assign index as key
                                       });
                                    }}
                                 />
                              </li>
                           );
                        }
                        return;
                     })}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AddTopicInWeekDay;
