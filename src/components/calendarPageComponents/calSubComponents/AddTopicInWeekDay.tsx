import React, { useContext, useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
// contexts
import { SessionContext } from "@/context/SessionContext";
// functions
import { getAllTopics } from "@/functions/TopicFunctions";
import { linkTopics, weekDayIdTopics } from "@/functions/CalendarFunctions";
// types
import type { topicProp, AddTopicInWeekDay } from "@/types";
// components
import { DotLoader } from "@/components/commonComponents/Loaders";
import TopicsSkeleton from "@/components/skeleton/calenderlanding/CalendarWeeklyPlans/TopicsSkeleton";

const AddTopicInWeekDay: React.FC<AddTopicInWeekDay> = ({
   weekDaySettings,
   setWeekDaySettings,
}) => {
   // session context
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const [topics, setTopics] = useState<topicProp[]>([]);
   const [newLinkedTopics, setNewLinkedTopics] = useState<{
      [key: number]: boolean;
   }>({});
   const [newTopicsUploadLoader, setNewTopicsUploadLoader] =
      useState<boolean>(false);
   const [newLinkedTopicsLoader, setNewLinkedTopicsLoader] =
      useState<boolean>(true);

   const fetchInitialTopics = async () => {
      try {
         const topicsRes = await getAllTopics();
         topicsRes.data.topics.sort((a: topicProp, b: topicProp) =>
            a.name.localeCompare(b.name)
         );

         setTopics(topicsRes.data.topics);
      } catch (error) {
         console.error(error);
      }
   };

   const fetchLinkedTopics = async () => {
      try {
         if (weekDaySettings?.dayId) {
            const linkedTopicsRes = await weekDayIdTopics({
               weekDayId: weekDaySettings?.dayId,
               userId: session?.user?.id,
            });

            const linkedTopics = linkedTopicsRes.topics?.reduce(
               (acc: { [key: number]: boolean }, topic: topicProp) => {
                  acc[topic.id] = true;
                  return acc;
               },
               {}
            );
            setNewLinkedTopics(linkedTopics || {});
            setNewLinkedTopicsLoader(false);
         }
      } catch (error) {
         console.error(error);
      }
   };

   // Fetch topics and linked topics on component load or weekDaySettings change
   useEffect(() => {
      if (session?.user?.id && weekDaySettings?.dayId !== undefined) {
         setNewLinkedTopics({});
         fetchLinkedTopics().then(() => fetchInitialTopics());
      }
   }, [weekDaySettings?.dayId]);

   // Handle applying topic changes
   const applyTopicChangeToWeekDay = async () => {
      try {
         if (weekDaySettings?.dayId && session?.user?.id) {
            setNewTopicsUploadLoader(true);
            const totalTopics = Object.keys(newLinkedTopics)
               .filter((key) => newLinkedTopics[Number(key)]) // Only include topics marked as true
               .map(Number);

            await linkTopics({
               userId: session.user.id,
               weekDayId: weekDaySettings.dayId,
               topics: totalTopics,
            });

            setNewTopicsUploadLoader(false);
         }
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div
         className={`${
            weekDaySettings?.open ? "fixed" : "hidden"
         } flex justify-center items-end md:items-center w-full h-full   md:p-10  z-50 top-0 left-0 `}
      >
         <div
            onClick={() => {
               setWeekDaySettings({ open: false });
               setNewLinkedTopicsLoader(true);
            }}
            className="absolute w-full h-full backdrop-blur-md backdrop-filter  "
         ></div>
         <span
            onClick={() => {
               setWeekDaySettings({ open: false });
               setNewLinkedTopicsLoader(true);
            }}
            className="absolute font-baloo top-2 right-2 md:top-10 md:right-10 cursor-pointer text-3xl text-white font-extrabold"
         >
            X
         </span>
         <div
            className={`relative p-4 mx-auto w-[100%] h-[calc(100%-50px)]   md:w-[90%] lg:w-[80%] md:h-[60%]  2xl:w-[50%] md:min-h-[500px] md:max-h-[75%] md:rounded-md z-10  backdrop-brightness-[.4] backdrop-blur-3xl overflow-hidden`}
         >
            <div className="relative h-[20%] md:h-[30%] bg-transparent rounded-md font-sofiaPro flex justify-center items-center cursor-pointer  before:absolute before:w-full before:h-full before:bg-gray-300 before:bg-opacity-5 before:blur-xl group ">
               <span
                  className={`absolute inset-0 flex justify-center items-center text-7xl md:text-9xl font-extrabold ${weekDaySettings?.color} opacity-30 transition-transform duration-300  group-hover:scale-0 group-hover:blur-sm`}
               >
                  {weekDaySettings?.day}
               </span>
               <span
                  className={`relative text-prim1 text-5xl md:text-7xl  font-bold transition-transform duration-500 group-hover:text-8xl group-hover:scale-110 ${weekDaySettings?.hoverColor}`}
               >
                  {weekDaySettings?.day}
               </span>
            </div>
            <div className="w-full h-[80%] md:flex justify-between md:h-[70%]">
               <div className="w-full h-[50%]  mb-2 md:h-full md:w-[40%] md:mb-0">
                  <span className="h-[40px] font-sofiaPro text-xl text-center block p-1 border-2 border-secod1 rounded-md">
                     Topics
                  </span>
                  <ul className="max-h-[calc(100%-50px)] flex flex-wrap justify-evenly mt-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-backg1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-front2">
                     {topics.length === 0 ? (
                        <TopicsSkeleton count={14} />
                     ) : (
                        topics?.map((topic: topicProp) => {
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
                        })
                     )}
                  </ul>
               </div>
               <div className="w-full h-[calc(50%-8px)] py-1 md:h-full md:w-[58%] md:px-2 border-[2px] border-bordr1 rounded-md">
                  <div className="h-[35px] flex justify-between font-sofiaPro  text-right px-2 ">
                     <span className="text-xl">Assigned Topics:</span>
                     <button
                        onClick={() => {
                           !newTopicsUploadLoader &&
                              applyTopicChangeToWeekDay();
                        }}
                        className="bg-secod1 rounded-sm px-5"
                     >
                        {newTopicsUploadLoader ? <DotLoader /> : "Apply"}
                     </button>
                  </div>
                  <ul className="max-h-[calc(100%-35px)] flex flex-wrap justify-evenly mt-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-backg1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-front2">
                     {newLinkedTopicsLoader || topics.length === 0 ? (
                        <TopicsSkeleton count={14} />
                     ) : (
                        topics?.map((topic: topicProp) => {
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
                        })
                     )}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AddTopicInWeekDay;
