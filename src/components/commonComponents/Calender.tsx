import React, { useState } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const Calendar: React.FC = () => {
   const [currentDate, setCurrentDate] = useState(new Date());

   const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
   const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];

   const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      return new Date(year, month + 1, 0).getDate();
   };

   const getStartingDay = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      return new Date(year, month, 1).getDay();
   };

   const previousMonth = () => {
      const prevDate = new Date(currentDate);
      prevDate.setMonth(prevDate.getMonth() - 1);
      setCurrentDate(prevDate);
   };

   const nextMonth = () => {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      setCurrentDate(nextDate);
   };

   const startingDay = getStartingDay(currentDate);
   const totalDays = getDaysInMonth(currentDate);

   return (
      <div className="hidden md:block relative p-2 font-sofiaPro text-prim2  bg-backg2 rounded-md">
         <div className="text-center">
            <div className="flex items-center justify-between  space-x-4">
               <h2 className=" font-medium">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
               </h2>
               <span>
                  <button onClick={previousMonth} className="text-2xl">
                     <IoMdArrowDropleft />
                  </button>
                  <button onClick={nextMonth} className="text-2xl">
                     <IoMdArrowDropright />
                  </button>
               </span>
            </div>
         </div>
         <div className="grid grid-cols-7 grid-rows-7 gap-2 mt-2">
            {days.map((day) => (
               <div key={day} className="text-center font-medium text-prim2">
                  {day}
               </div>
            ))}
            {[...Array(startingDay)].map((_, index) => (
               <div key={`empty-${index}`} className="text-center text-seco2">
                  {""}
               </div>
            ))}
            {[...Array(totalDays)].map((_, day) => (
               <div
                  key={day}
                  onClick={() => console.log(currentDate.getDay())}
                  className={`text-center w-7 h-7 p-[2px] text-seco1 cursor-pointer ${
                     currentDate.getDate() === day + 1
                        ? "bg-secod1 text-seco2"
                        : "hover:bg-backg1 hover:text-prim1"
                  }  rounded-full`}
               >
                  {day + 1}
               </div>
            ))}
         </div>
      </div>
   );
};

export default Calendar;
