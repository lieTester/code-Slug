import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

type CalendarCell = {
   date: Date;
   isInCurrentMonth: boolean;
};

const CalenderBase: React.FC = () => {
   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
   const [presentMonth] = useState<Date>(new Date());
   const gridRef = useRef<HTMLDivElement | null>(null);
   const [hoveredElements, setHoveredElements] = useState<HTMLElement[]>([]);

   const offset = 79;
   const borderWidth = 3;
   const angles: number[] = [];
   for (let i = 0; i <= 2; i += 0.25) {
      angles.push(Math.PI * i);
   }

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
         days.push({ date: new Date(year, month, i), isInCurrentMonth: true });
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

   useEffect(() => {
      setDays(getDaysInMonth(currentMonth));
   }, [currentMonth]);

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
      <div
         ref={gridRef}
         className="w-full h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1 p-4 rounded-lg"
      >
         <div className="h-[7%] flex justify-between items-center mb-4">
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
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
               <div key={day} className="text-center h-full">
                  {day}
               </div>
            ))}
            {days.map((day, index) => (
               <div
                  key={index}
                  className={`relative day-btn z-10  after:rounded-sm hover:border-white border-transparent border-[3px] after:-z-10 after:absolute after:top-0 after:left-0 after:w-full after:h-full ${
                     day.date.getDate() === presentMonth.getDate() &&
                     currentMonth.getMonth() === presentMonth.getMonth() &&
                     currentMonth.getFullYear() === presentMonth.getFullYear()
                        ? "bg-secod1 border-[#a0aec0]"
                        : `after:bg-blue-950`
                  } after:backdrop-filter after:backdrop-blur-sm py-2 text-center h-full flex items-center justify-center ${
                     day.isInCurrentMonth
                        ? "after:bg-opacity-50"
                        : "after:bg-opacity-20"
                  }`}
               >
                  {day.date.getDate()}
               </div>
            ))}
         </div>
      </div>
   );
};

export default CalenderBase;
