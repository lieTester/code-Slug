import React, { useState, useEffect, useRef, useContext } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import {
   IoIosCodeWorking,
   IoMdArrowDropleft,
   IoMdArrowDropright,
} from "react-icons/io";
// context
import { SessionContext } from "@/context/SessionContext";
// function
import { fetchUserProblemStatuses } from "@/functions/ProblemFunctions";
// types
import { StatusByDate } from "@/types";

type CalendarCell = {
   date: Date;
   isInCurrentMonth: boolean;
};

const CalendarBase: React.FC = () => {
   // session context
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;
   // states and variables
   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
   const [problemStatusesOfMonthLoader, setproblemStatusesOfMonthLoader] =
      useState<boolean>(true);
   const [problemStatusesOfMonth, setproblemStatusesOfMonth] =
      useState<StatusByDate>({});
   const [presentMonth] = useState<Date>(new Date());
   const gridRef = useRef<HTMLDivElement | null>(null);
   const [hoveredElements, setHoveredElements] = useState<HTMLElement[]>([]);

   // calendar var for styling and creation///////////////////////////////////////
   const offset = 79;
   const borderWidth = 3;
   const angles: number[] = [];
   for (let i = 0; i <= 2; i += 0.25) {
      angles.push(Math.PI * i);
   }

   // function for calendar base creation//////////////////////////////////////////
   const getDaysInMonth = (date: Date): CalendarCell[] => {
      const month = date.getMonth();
      const year = date.getFullYear();
      const firstDay = new Date(year, month, 1);
      const startDayOfWeek = (firstDay.getDay() + 7) % 7;

      let days: CalendarCell[] = [];
      const daysBeforeFirst = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

      for (let i = daysBeforeFirst; i > 0; i--) {
         days.push({
            date: new Date(year, month, -i + 1),
            isInCurrentMonth: false,
         });
      }

      const lastDay = new Date(year, month + 1, 0);
      for (let i = 1; i <= lastDay.getDate(); i++) {
         days.push({
            date: new Date(year, month, i),
            isInCurrentMonth: true,
         });
      }

      const daysAfterLast = 42 - days.length;
      for (let i = 1; i <= daysAfterLast; i++) {
         days.push({
            date: new Date(year, month + 1, i),
            isInCurrentMonth: false,
         });
      }

      return days;
   };

   const [days, setDays] = useState<CalendarCell[]>(
      getDaysInMonth(currentMonth)
   );

   const changeMonth = (offset: number) => {
      const newMonth = new Date(
         currentMonth.setMonth(currentMonth.getMonth() + offset)
      );
      setCurrentMonth(newMonth);
   };

   const clearNearbyStyles = () => {
      hoveredElements.forEach((element) => {
         element.style.borderImage = ""; // Set to empty string to clear the style
      });
      setHoveredElements([]);
   };

   // fetch problens solved or attempted for showing month selection
   const fetchUserProblemsMonthStaus = async () => {
      try {
         setproblemStatusesOfMonthLoader(true);
         setproblemStatusesOfMonth({});
         await fetchUserProblemStatuses({
            userId: session?.user?.id,
            month: currentMonth?.getMonth() + 1, //In JavaScript, Date.getMonth() returns a zero-based index for the month, meaning:
            year: currentMonth?.getFullYear(),
         }).then((res) => {
            setproblemStatusesOfMonth(res.monthStatus);
            setproblemStatusesOfMonthLoader(false);
         });
      } catch (error) {
         console.error(error);
      }
   };
   // useEffects
   useEffect(() => {
      setDays(getDaysInMonth(currentMonth));
      session?.user?.id && fetchUserProblemsMonthStaus();
   }, [currentMonth]);
   useEffect(() => {
      session?.user?.id && fetchUserProblemsMonthStaus();
   }, [session?.user?.id]);

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         const x = e.clientX;
         const y = e.clientY;

         clearNearbyStyles(); // Clear previous effects

         let nearbyElements: HTMLElement[] = [];

         angles.forEach((rad) => {
            const offsets = [offset * 0.35, offset * 1.105];
            offsets.forEach((o) => {
               const cx = Math.floor(x + Math.cos(rad) * o);
               const cy = Math.floor(y + Math.sin(rad) * o);
               const element = document.elementFromPoint(cx, cy) as HTMLElement;

               if (
                  element &&
                  element.classList.contains("day-btn") &&
                  !element.classList.contains("win-btn-active") &&
                  !element.classList.contains("win-btn-selected") &&
                  !nearbyElements.includes(element)
               ) {
                  const brect = element.getBoundingClientRect();
                  const bx = x - brect.left; // x position within the element.
                  const by = y - brect.top; // y position within the element.
                  const gr = Math.floor(offset * 1.7);
                  element.style.borderImage = `radial-gradient(${gr}px ${gr}px at ${bx}px ${by}px ,#a0aec0,#a0aec0,transparent ) 9 / ${borderWidth}px / 0px stretch`;
                  nearbyElements.push(element);
               }
            });
         });

         setHoveredElements(nearbyElements);
      };

      const grid = gridRef.current;
      grid?.addEventListener("mousemove", handleMouseMove);

      return () => {
         grid?.removeEventListener("mousemove", handleMouseMove);
      };
   }, [angles, hoveredElements]);

   return (
      <div ref={gridRef} className="h-full">
         <div className="h-[7%] flex justify-between items-center ">
            <button onClick={() => changeMonth(-1)} className="text-xl">
               <IoMdArrowDropleft />
            </button>
            <span>
               {currentMonth.toLocaleString("default", { month: "long" })}{" "}
               {currentMonth.getFullYear()}
            </span>
            <button onClick={() => changeMonth(1)} className="text-xl">
               <IoMdArrowDropright />
            </button>
         </div>
         <div className="grid grid-cols-7 gap-[2px] h-[93%]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
               <div key={day} className=" flex justify-center items-center  ">
                  {day}
               </div>
            ))}
            {days.map((day, index) => (
               <div
                  key={index}
                  // the day-btn and win-btn-active are classes for mouse-hover animation
                  // after is for better designability
                  // py-3 so the the above divs of week should get less height and design look better
                  className={`relative py-3 flex items-center justify-center day-btn overflow-hidden z-10 border-transparent border-[3px]   after:-z-10 after:absolute after:top-0 after:left-0 after:inset-0 after:rounded-sm 
                     ${
                        // this whole beow checks is for highliting current month and today's day highlight
                        day.date.getDate() === presentMonth.getDate() &&
                        currentMonth.getMonth() === presentMonth.getMonth() &&
                        currentMonth.getFullYear() ===
                           presentMonth.getFullYear() &&
                        day.isInCurrentMonth
                           ? "bg-secod1 border-[#a0aec0] win-btn-active "
                           : `after:bg-blue-950`
                     } ${
                     day.isInCurrentMonth
                        ? "after:bg-opacity-50"
                        : "after:bg-opacity-20  "
                  }`}
               >
                  {problemStatusesOfMonthLoader && day.isInCurrentMonth ? (
                     <ul
                        className={`absolute inset-0 top-0 right-0  animate-pulse bg-blue-950 z-[-9] `}
                     ></ul>
                  ) : (
                     <>
                        <ul className="absolute w-[50%] flex top-0 right-0 text-xs ">
                           <li className="flex">
                              {problemStatusesOfMonth[
                                 `${day.date.getDate()}`
                              ]?.["solved"]?.length && (
                                 <BsCheck2Circle className="text-easy mt-[1px] mr-1 cursor-pointer  " />
                              )}

                              {
                                 problemStatusesOfMonth[
                                    `${day.date.getDate()}`
                                 ]?.["solved"]?.length
                              }
                           </li>
                           <li className="mx-[2px] truncate">
                              {problemStatusesOfMonth[
                                 `${day.date.getDate()}`
                              ]?.["solved"]?.length && "solved"}
                           </li>
                        </ul>
                        <ul className="absolute w-[70%] flex bottom-0 left-0 text-xs ">
                           <li className="flex">
                              {problemStatusesOfMonth[
                                 `${day.date.getDate()}`
                              ]?.["attempted"]?.length && (
                                 <IoIosCodeWorking className="text-medium mt-[1px] mr-1 cursor-pointer  " />
                              )}

                              {
                                 problemStatusesOfMonth[
                                    `${day.date.getDate()}`
                                 ]?.["attempted"]?.length
                              }
                           </li>
                           <li className="mx-[2px] truncate">
                              {problemStatusesOfMonth[
                                 `${day.date.getDate()}`
                              ]?.["attempted"]?.length && "attempted"}
                           </li>
                        </ul>
                     </>
                  )}
                  {day.date.getDate()}
               </div>
            ))}
         </div>
      </div>
   );
};

export default CalendarBase;
