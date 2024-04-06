import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

type CalendarCell = {
   date: Date;
   isInCurrentMonth: boolean;
};

const CalendarLandingBodyBaseSkeleton: React.FC = () => {
   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

   return (
      <div className="w-full h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1 px-4 rounded-lg">
         <div className="h-[7%] flex justify-between items-center animate-pulse">
            <span className="bg-slate-800 w-6 rounded-full h-6"></span>
            <span className="w-[150px] bg-slate-800  h-6 rounded-sm"></span>

            <span className="bg-slate-800 w-6 rounded-full h-6"></span>
         </div>
         <div className="grid grid-cols-7 gap-[2px] h-[93%]">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
               <div
                  key={day}
                  className="flex justify-center items-center  h-full animate-pulse"
               >
                  <span className="bg-slate-800 w-10 rounded-sm h-4"></span>
               </div>
            ))}
            {days.map((day, index) => (
               <div
                  key={index}
                  className={`relative py-3 day-btn z-10  text-center h-full flex items-center justify-center border-transparent border-[3px] after:rounded-sm  after:-z-10 after:absolute after:top-0 after:left-0 after:w-full after:h-full animate-pulse
                      after:bg-blue-950 after:backdrop-filter after:backdrop-blur-sm  ${
                         day.isInCurrentMonth
                            ? "after:bg-opacity-50"
                            : "after:bg-opacity-20"
                      }`}
               ></div>
            ))}
         </div>
      </div>
   );
};

export default CalendarLandingBodyBaseSkeleton;
