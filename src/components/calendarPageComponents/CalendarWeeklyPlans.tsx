import React, { useContext, useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaDisplay } from "react-icons/fa6";
import {
   MdAddChart,
   MdDeleteOutline,
   MdFileUpload,
   MdVisibilityOff,
} from "react-icons/md";
import Image from "next/image";

// component
import CalWeekBanner1 from "./calSubComponents/CalWeekBanner1";
import CalWeekBanner2 from "./calSubComponents/CalWeekBanner2";
import {
   createWeekCalendar,
   getAllUserCalendars,
   getWeekDaysAndTopics,
} from "@/functions/CalendarFunctions";
import { SessionContext } from "@/context/SessionContext";
import { DotLoader } from "../commonComponents/Loaders";

type calendarsProp = {
   id: string;
   title: string;
   days: {
      id: number;
      name: string;
      count?: number;
      topics?: { id: number; name: string }[];
   }[];
};

const CalendarWeeklyPlans: React.FC = () => {
   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const [calendars, setCalendars] = useState<calendarsProp[]>();
   const [currentCalendarData, setCurrentCalendarData] = useState<
      calendarsProp["days"] | null
   >(null);
   const [calendarDetailsLoader, setCalendarDetailsLoader] =
      useState<boolean>(false);
   const [selectedCalendar, setSelectedCalendar] = useState<{
      id?: string;
      name: string;
   }>({ id: "", name: "" });
   const [open, setOpen] = useState<boolean>(false);

   const [isCreate, setIsCreate] = useState<boolean>(true);

   // calendar functions //////////////////////////////////////////////////////
   const fetchData = async () => {
      await getAllUserCalendars(session?.user?.id).then((res) => {
         console.log(res);
         setCalendars(res?.formattedCalendars);
      });
   };

   const showDeleteCalendar = async (id: string, name: string) => {
      setOpen(true);
      setIsCreate(false);
      setSelectedCalendar(() => {
         return { id, name };
      });
   };
   const showCreateCalendar = async () => {
      setOpen(true);
      setIsCreate(true);
   };

   const manageCreateOrDeleteWeekCalender = async (type: string) => {
      try {
         if (type === "delete") {
         } else if (type === "create") {
            await createWeekCalendar(session?.user?.id, selectedCalendar?.name);
         }
      } catch (error) {
         console.error(error);
      } finally {
         fetchData().then(() => onClose());
      }
   };
   const onClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      fetchData();
   }, []);
   return (
      <section className="w-full h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1  rounded-lg">
         <div className="w-full h-[30%] rounded-t-lg overflow-y-auto border-[2px] border-secod1">
            <span className="w-full h-[45px] p-2 pl-4 block bg-backg2 font-sofiaPro font-extrabold text-red-300 text-lg">
               Weekly Calendar Plans :
            </span>
            <div className="w-full  h-[calc(100%-45px)] flex flex-wrap p-2  space-x-2 overflow-y-auto [&>*]:h-[55px] [&>*]:border-[2px] [&>*]:border-bordr1">
               {calendars?.map((calendar) => {
                  return (
                     <ul
                        key={calendar?.id}
                        className="relative w-fit  flex min-w-[220px] max-w-[350px] p-1 cursor-alias rounded-md overflow-hidden  z-10 before:z-[-1] before:absolute before:w-full before:h-full before:bg-white before:bg-opacity-20 before:blur-xl  "
                     >
                        <li className="relative w-full pb-4">
                           <span className=" font-sofiaPro font- ml-[2px]">
                              {calendar?.title}
                           </span>
                           <ul className=" top-6 w-full flex space-x-[2px] text-xs text-prim2 [&>*]:bg-backg1 [&>*]:px-1 [&>*]:text-center [&>*]:rounded-md">
                              {calendar?.days?.map((day) => {
                                 if (day?.count === 0) return;
                                 return (
                                    <li key={day?.id}>
                                       {day.name.slice(0, 2)}
                                    </li>
                                 );
                              })}
                           </ul>
                        </li>
                        <li className=" [&>*]:rounded-full flex">
                           <button
                              title={"Apply Calendar"}
                              className="text-green-500 text-2xl w-full px-1"
                           >
                              <MdFileUpload />
                           </button>
                           <button
                              title={"Display Calendar Details"}
                              onClick={async () => {
                                 setSelectedCalendar((prev) => {
                                    return { ...prev, id: calendar.id };
                                 });
                                 setCalendarDetailsLoader(true);
                                 await getWeekDaysAndTopics(
                                    session?.user?.id,
                                    calendar?.id
                                 ).then((res) => {
                                    console.log(res);
                                    setCurrentCalendarData(
                                       res?.formattedWeekDays
                                    );
                                    setCalendarDetailsLoader(false);
                                 });
                              }}
                              className="text-blue-300 text-xl w-full px-1"
                           >
                              {selectedCalendar?.id !== calendar.id ? (
                                 <FaDisplay />
                              ) : (
                                 <MdVisibilityOff />
                              )}
                           </button>
                           <button
                              title={"Delete Calendar"}
                              className="text-red-700 text-2xl w-full px-1 "
                           >
                              <MdDeleteOutline />
                           </button>
                        </li>
                     </ul>
                  );
               })}
               <button
                  className="relative overflow-hidden w-[55px] bg-slate-500 p-1 rounded-full flex justify-center items-center text-2xl "
                  onClick={showCreateCalendar}
               >
                  <MdAddChart />
               </button>
            </div>
            <div
               className={`${
                  open ? "fixed" : "hidden"
               }   top-0 left-0 inset-0 flex items-center justify-center z-[100]  fade`}
            >
               <div
                  onClick={onClose}
                  className="absolute w-full h-full backdrop-blur-md backdrop-filter  "
               ></div>
               <div
                  className={`${
                     isCreate ? "hidden" : "block"
                  } min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-2xl font-extrabold mx-auto bg-backg2`}
               >
                  <div className="w-fit mx-auto">
                     Are You Sure You want to{" "}
                     <span className="text-hard">delete </span>
                     {selectedCalendar?.name}?
                  </div>
                  <div className="mt-4 flex justify-around [&>*]:px-2 [&>*]:py-1">
                     <button
                        onClick={onClose}
                        className="text-hard border-[2px] border-secod3"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={() => {
                           manageCreateOrDeleteWeekCalender("delete");
                        }}
                        className="text-easy border-[2px] border-secod3"
                     >
                        Ok
                     </button>
                  </div>
               </div>
               <div
                  className={`${
                     isCreate ? "block" : "hidden"
                  } min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-2xl font-extrabold mx-auto bg-backg2`}
               >
                  <label htmlFor="">Enter Calendar Name:</label>
                  <input
                     type="text"
                     className="w-full mx-auto bg-transparent border-[2px] border-secod1 p-1 outline-none text-red-200"
                     value={selectedCalendar ? selectedCalendar.name : ""}
                     onChange={(e) => {
                        setSelectedCalendar(
                           (prev: { id?: string; name: string }) => {
                              return { ...prev, name: e.target.value };
                           }
                        );
                     }}
                  />

                  <div className="mt-4 flex justify-around [&>*]:px-2 [&>*]:py-1">
                     <button
                        onClick={onClose}
                        className="text-hard border-[2px] border-secod3"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={() => {
                           manageCreateOrDeleteWeekCalender("create");
                        }}
                        className="text-easy border-[2px] border-secod3"
                     >
                        Ok
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div
            className={`w-full ${
               calendarDetailsLoader && "h-[70%]"
            }  py-4 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg`}
         >
            {/* {if we want a scroll in above div css we can put h-[70%],pr-2  and overflow-y-auto} */}
            {calendarDetailsLoader ? (
               <DotLoader />
            ) : (
               <div className="gap-4 w-full columns-2 md:columns-1 lg:columns-3  space-y-4  [&>*]:break-inside-avoid [&>*]:overflow-hidden">
                  {currentCalendarData && (
                     <>
                        <CalWeekBanner1
                           color="text-red-500"
                           hoverColor="group-hover:text-red-300"
                           day="Mon"
                        >
                           <ul className="w-full flex  flex-wrap justify-stretch space-x-2 [&>*]:my-1">
                              {currentCalendarData[0]?.topics &&
                                 currentCalendarData[0]?.topics.map((topic) => {
                                    return (
                                       <li
                                          key={topic?.id}
                                          className={` flex items-center justify-between rounded-sm text-[13px] bg-secod3`}
                                       >
                                          <span className="mx-1 mt-[1px]">
                                             {topic?.name}
                                          </span>
                                          <AiOutlineCloseCircle
                                             className="text-prim2 cursor-pointer hover:text-prim1 "
                                             onClick={() => {}}
                                          />
                                       </li>
                                    );
                                 })}
                           </ul>
                        </CalWeekBanner1>

                        <CalWeekBanner2
                           color="before:bg-blue-200"
                           hoverColor="="
                           day="Tue"
                        >
                           <div>Your content </div>
                        </CalWeekBanner2>
                        <CalWeekBanner1
                           color="text-gray-600"
                           hoverColor="group-hover:text-gray-400"
                           day="Wed"
                        >
                           <div>Your content </div>
                        </CalWeekBanner1>

                        <CalWeekBanner2
                           color="before:bg-pink-200"
                           hoverColor="="
                           day="Thu"
                        >
                           <div>Your content </div>
                        </CalWeekBanner2>
                        <CalWeekBanner1
                           color="text-green-800"
                           hoverColor="group-hover:text-green-400"
                           day="Fri"
                        >
                           <div>Your content </div>
                        </CalWeekBanner1>

                        <CalWeekBanner2
                           color="before:bg-blue-800"
                           hoverColor="="
                           day="Sat"
                        >
                           <div>Your content </div>
                        </CalWeekBanner2>
                        <CalWeekBanner1
                           color="text-yellow-700"
                           hoverColor="group-hover:text-yellow-300"
                           day="Sun"
                        >
                           <div>Your content </div>
                        </CalWeekBanner1>
                     </>
                  )}
               </div>
            )}
         </div>
         {/* Section of Edit and Add */}
      </section>
   );
};

export default CalendarWeeklyPlans;
