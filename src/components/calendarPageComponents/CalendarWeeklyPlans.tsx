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

const CalendarWeeklyPlans: React.FC = () => {
   // session context //////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // calendar states //////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////
   // all calendar of user plus default details
   const [calendars, setCalendars] = useState<calendarsProp[]>();
   const [calendarsLoader, setCalendarsLoader] = useState<boolean>(true);
   // view weekCalendar details of selected calendar
   const [viewCalendarData, setViewCalendarData] =
      useState<viewCalendarDataProp | null>(null);
   const [viewCalendarDataLoader, setViewCalendarDataLoader] = useState<{
      id?: string;
      name?: string;
      loader: boolean;
   }>({ loader: false });

   // data to delete calendar
   const [calendarToDelete, setCalendarToDelete] = useState<{
      id?: string;
      name?: string;
      loader: boolean;
      visiblity: boolean;
   }>({ visiblity: false, loader: false });

   // new calendar
   const [newCalendatDetail, setNewCalendatDetail] = useState<{
      name?: string;
      loader: boolean;
      visiblity: boolean;
   }>({ visiblity: false, loader: false });

   // open close the popup window for create and delete block of calendar
   const [open, setOpen] = useState<boolean>(false);

   //
   const [openWeekDayCalendar, setOpenWeekDayCalendar] = useState<{
      day?: string;
      open: boolean;
      dayId?: number;
      color?: string;
      banner?: number;
      hoverColor?: string;
   }>({ open: false });

   // block createion details for week days
   const weekDaysSettings: {
      banner: number;
      color: string;
      hoverColor: string;
      day: string;
   }[] = [
      {
         banner: 1,
         day: "Monday",
         color: "text-red-500",
         hoverColor: "group-hover:text-red-300",
      },
      {
         banner: 2,
         day: "Tuesday",
         color: "before:bg-blue-200",
         hoverColor: "group-hover:text-blue-200",
      },
      {
         banner: 1,
         day: "Wednesday",
         color: "text-gray-600",
         hoverColor: "group-hover:text-gray-400",
      },
      {
         banner: 2,
         day: "Thursday",
         color: "before:bg-pink-200",
         hoverColor: "group-hover:text-pink-200",
      },
      {
         banner: 1,
         day: "Friday",
         color: "text-green-800",
         hoverColor: "group-hover:text-green-400",
      },
      {
         banner: 2,
         day: "Saturday",
         color: "before:bg-blue-800",
         hoverColor: "group-hover:text-blue-800",
      },
      {
         banner: 1,
         day: "Sunday",
         color: "text-yellow-700",
         hoverColor: "group-hover:text-yellow-300",
      },
   ];
   // calendar functions //////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   const fetchData = async () => {
      setCalendarsLoader(true);
      await getAllUserCalendars(session?.user?.id)
         .then((res) => {
            // console.log(res);
            setCalendars(res?.formattedCalendars);
         })
         .then((res) => {
            setCalendarsLoader(false);
         });
   };

   const showDeleteCalendar = async (id: string, name: string) => {
      setOpen(true);
      setCalendarToDelete((prev) => {
         return { ...prev, id, name, visiblity: true };
      });
   };
   const showCreateCalendar = async () => {
      setOpen(true);
      setNewCalendatDetail((prev) => {
         return { ...prev, visiblity: true };
      });
   };

   const manageCreateOrDeleteWeekCalender = async (type: string) => {
      try {
         if (type === "delete") {
            setCalendarToDelete((prev) => {
               return { ...prev, loader: true };
            });
            calendarToDelete?.id &&
               (await deleteWeekCalendar(
                  session?.user?.id,
                  calendarToDelete?.id
               ));
         } else if (type === "create") {
            setNewCalendatDetail((prev) => {
               return { ...prev, loader: true };
            });
            newCalendatDetail?.name &&
               (await createWeekCalendar(
                  session?.user?.id,
                  newCalendatDetail?.name
               ));
         }
      } catch (error) {
         console.error(error);
      } finally {
         fetchData().then(() => {
            onClose();
         });
      }
   };
   const onClose = () => {
      setOpen(false);
      setCalendarToDelete({ visiblity: false, loader: false });
      setNewCalendatDetail({ visiblity: false, loader: false });
   };

   useEffect(() => {
      fetchData();
   }, []);
   return (
      <section className="w-full h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1  rounded-lg">
         <div className="w-full h-[30%] rounded-t-lg overflow-y-auto border-[2px] border-secod1">
            <span className="w-full h-[45px] flex justify-between  p-2 pl-4  bg-backg2 font-sofiaPro font-extrabold text-red-300 text-lg">
               <label htmlFor="">Weekly Calendar Plans :</label>
               <button
                  onClick={() => {
                     fetchData();
                  }}
                  className="font-extrabold text-2xl"
               >
                  <TbRefresh />
               </button>
            </span>
            <div className="w-full  h-[calc(100%-45px)] flex flex-wrap p-2 overflow-y-auto [&>*]:mr-1 [&>*]:mb-1  [&>*]:h-[55px] [&>*]:border-[2px] [&>*]:border-bordr1">
               {calendarsLoader ? (
                  <AllUserCalendarSkeleton />
               ) : (
                  calendars?.map((calendar) => {
                     return (
                        <ul
                           key={calendar?.id}
                           className="relative w-fit  flex min-w-[220px] max-w-[350px] p-1  rounded-md overflow-hidden  backdrop-brightness-[.6] backdrop-blur-3xl  "
                        >
                           <li className="relative w-full pb-4">
                              <span className=" font-sofiaPro font- ml-[2px] capitalize">
                                 {calendar?.title}
                              </span>
                              <ul className=" top-6 w-full flex space-x-[2px] text-xs text-prim2 ">
                                 {calendar?.days?.map((day) => {
                                    if (day?.count === 0) return;
                                    return (
                                       <li
                                          key={day?.id}
                                          className="bg-secod1 px-1 text-center rounded-md hover:text-white cursor-default"
                                       >
                                          {day.name.slice(0, 2)}
                                       </li>
                                    );
                                 })}
                              </ul>
                           </li>
                           <li className=" [&>*]:rounded-full flex">
                              <button
                                 title={"Display Calendar Details"}
                                 onClick={async () => {
                                    setViewCalendarDataLoader({
                                       id: calendar.id,
                                       loader: true,
                                    });
                                    await getWeekDaysAndTopics(
                                       session?.user?.id,
                                       calendar?.id
                                    ).then((res) => {
                                       setViewCalendarData(
                                          res?.formattedWeekDays
                                       );
                                       setViewCalendarDataLoader((prev) => {
                                          return {
                                             ...prev,
                                             loader: false,
                                          };
                                       });
                                    });
                                 }}
                                 className="text-blue-300 text-xl w-full px-1"
                              >
                                 {viewCalendarDataLoader?.id !== calendar.id ? (
                                    <FaDisplay />
                                 ) : (
                                    <TbRefresh />
                                 )}
                              </button>
                              <button
                                 title={"Delete Calendar"}
                                 onClick={() =>
                                    showDeleteCalendar(
                                       calendar.id,
                                       calendar.title
                                    )
                                 }
                                 className="text-red-700 text-2xl w-full px-1 "
                              >
                                 <MdDeleteOutline />
                              </button>
                           </li>
                        </ul>
                     );
                  })
               )}
               <button
                  title="Create new Weekly Calendar"
                  className="relative overflow-hidden w-[55px] p-1 rounded-full flex justify-center items-center text-2xl backdrop-brightness-[.6] backdrop-blur-3xl group"
                  onClick={showCreateCalendar}
               >
                  <MdAddChart className="group-hover:hover:scale-125 transform transition-transform duration-100" />
               </button>
            </div>
            {/* Ui block for confirmation to delete and create Calendar */}
            <div
               className={`${
                  open ? "fixed" : "hidden"
               }   top-0 left-0 inset-0 flex items-center justify-center z-[100]  fade`}
            >
               <div
                  onClick={onClose}
                  className="absolute w-full h-full backdrop-blur-md backdrop-filter  "
               ></div>
               {/* Delete Calendar block */}
               <div
                  className={`${
                     calendarToDelete?.visiblity ? "block" : "hidden"
                  } min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-2xl font-extrabold mx-auto bg-backg2`}
               >
                  <div className="w-fit mx-auto">
                     Are You Sure You want to{" "}
                     <span className="text-hard">delete </span>
                     {calendarToDelete?.name}?
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
                           !calendarToDelete?.loader &&
                              manageCreateOrDeleteWeekCalender("delete");
                        }}
                        className="text-easy border-[2px] border-secod3"
                     >
                        {calendarToDelete?.loader ? <DotLoader /> : "Ok"}
                     </button>
                  </div>
               </div>
               {/* Create Calendar block */}
               <div
                  className={`${
                     newCalendatDetail?.visiblity ? "block" : "hidden"
                  } min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-2xl font-extrabold mx-auto bg-backg2`}
               >
                  <label htmlFor="">Enter Calendar Name:</label>
                  <input
                     type="text"
                     className="w-full mx-auto bg-transparent border-[2px] border-secod1 p-1 outline-none text-red-200"
                     value={
                        newCalendatDetail?.name ? newCalendatDetail.name : ""
                     }
                     onChange={(e) => {
                        setNewCalendatDetail((prev) => {
                           return { ...prev, name: e.target.value };
                        });
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
                           !newCalendatDetail?.loader &&
                              manageCreateOrDeleteWeekCalender("create");
                        }}
                        className="text-easy border-[2px] border-secod3"
                     >
                        {newCalendatDetail?.loader ? <DotLoader /> : "Ok"}
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div
            className={`w-full ${
               viewCalendarDataLoader?.loader && "h-[70%]"
            }  py-4 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg`}
         >
            {/* {if we want a scroll in above div css we can put h-[70%],pr-2  and overflow-y-auto} */}
            {viewCalendarDataLoader?.loader ? (
               <DotLoader />
            ) : (
               <div className="gap-4 w-full columns-1 sm:columns-2 md:columns-1 lg:columns-2 xl:columns-3  space-y-4  [&>*]:break-inside-avoid [&>*]:overflow-hidden">
                  {viewCalendarData &&
                     weekDaysSettings?.map((day, index) => {
                        if (day.banner === 1) {
                           return (
                              viewCalendarData[day.day] && (
                                 <CalWeekBanner1
                                    key={viewCalendarData[day.day].id}
                                    day={day.day}
                                    color={day.color}
                                    hoverColor={day.hoverColor}
                                    setOpen={setOpenWeekDayCalendar}
                                    dayId={viewCalendarData[day.day].id}
                                 >
                                    <ul
                                       key={viewCalendarData[day.day].id}
                                       className="w-full flex  flex-wrap justify-stretch [&>*]:mr-2 [&>*]:my-1"
                                    >
                                       {viewCalendarData[day.day]?.topics.map(
                                          (topic) => {
                                             return (
                                                <li
                                                   key={topic?.id}
                                                   className={` flex items-center justify-between rounded-sm text-[13px] bg-secod3`}
                                                >
                                                   <span className="mx-1 mt-[1px]">
                                                      {topic?.name}
                                                   </span>
                                                </li>
                                             );
                                          }
                                       )}
                                    </ul>
                                 </CalWeekBanner1>
                              )
                           );
                        }
                        return (
                           viewCalendarData[day.day] && (
                              <CalWeekBanner2
                                 key={viewCalendarData[day.day].id}
                                 day={day.day}
                                 color={day.color}
                                 hoverColor={day.hoverColor}
                                 setOpen={setOpenWeekDayCalendar}
                                 dayId={viewCalendarData[day.day].id}
                              >
                                 <ul
                                    key={viewCalendarData[day.day].id}
                                    className="w-full flex  flex-wrap justify-stretch [&>*]:mr-2 [&>*]:my-1"
                                 >
                                    {viewCalendarData[day.day]?.topics.map(
                                       (topic) => {
                                          return (
                                             <li
                                                key={topic?.id}
                                                className={` flex items-center justify-between rounded-sm text-[13px] bg-secod3`}
                                             >
                                                <span className="mx-1 mt-[1px]">
                                                   {topic?.name}
                                                </span>
                                             </li>
                                          );
                                       }
                                    )}
                                 </ul>
                              </CalWeekBanner2>
                           )
                        );
                     })}
               </div>
            )}
         </div>

         {/* Section of Edit and Add */}
         <AddTopicInWeekDay
            weekDaySettings={openWeekDayCalendar}
            setWeekDaySettings={setOpenWeekDayCalendar}
            weekCalendarId={viewCalendarDataLoader?.id || ""}
         />
      </section>
   );
};

export default CalendarWeeklyPlans;
