import React, { useState, useEffect } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

type CalendarCell = {
   date: Date;
   isInCurrentMonth: boolean;
};

const CalenderBase: React.FC = () => {
   const [currentMonth, setCurrentMonth] = useState(new Date());
   const [presentMonth, setPresentMonth] = useState(new Date()); // for when we change month today date higlet only in it

   const getDaysInMonth = (date: Date): CalendarCell[] => {
      const month = date.getMonth();
      const year = date.getFullYear();

      // Find the first day of the month
      const firstDay = new Date(year, month, 1);
      // Adjusted start day to Monday
      const startDayOfWeek = (firstDay.getDay() + 7) % 7; // Adjust so Monday is 0

      let days: CalendarCell[] = [];

      // Calculate days needed to fill the first row from Monday
      const daysBeforeFirst = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

      // Fill the days before the first day of the month
      for (let i = daysBeforeFirst; i > 0; i--) {
         const day = new Date(year, month, -i + 1);
         days.push({ date: day, isInCurrentMonth: false });
      }

      // Get all days in the month
      const lastDay = new Date(year, month + 1, 0);
      for (let i = 1; i <= lastDay.getDate(); i++) {
         days.push({ date: new Date(year, month, i), isInCurrentMonth: true });
      }

      // Fill the trailing days to complete the calendar grid
      const lastDayOfWeek = lastDay.getDay();
      const daysAfterLast = 42 - days.length;
      for (let i = 1; i <= daysAfterLast; i++) {
         const day = new Date(year, month + 1, i);
         days.push({ date: day, isInCurrentMonth: false });
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

   return (
      <div className="w-full h-full  text-white p-4 rounded-lg">
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
         <div className="grid grid-cols-7 gap-1 h-[93%]">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
               <div key={day} className="text-center h-full">
                  {day}
               </div>
            ))}
            {days.map((day, index) => (
               <div
                  key={index}
                  className={`relative z-10 hover:border- after:rounded-sm hover:border-white border-transparent border-[1px] after:-z-10 after:absolute after:top-0 after:left-0 after:w-full after:h-full ${
                     day.date.getDate() === presentMonth.getDate() &&
                     currentMonth.getMonth() === presentMonth.getMonth() &&
                     currentMonth.getFullYear() === presentMonth.getFullYear()
                        ? "bg-secod1 border-white"
                        : `after:bg-blue-950`
                  } after:backdrop-filter after:backdrop-blur-sm py-2 text-center h-full flex items-center justify-center  ${
                     day.isInCurrentMonth
                        ? "after:bg-opacity-40"
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
