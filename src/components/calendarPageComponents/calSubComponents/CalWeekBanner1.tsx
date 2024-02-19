import React from "react";
import { CalWeekBannerProps } from "@/types";

const CalWeekBanner1: React.FC<CalWeekBannerProps> = ({
   day,
   dayId,
   color,
   setOpen,
   children,
   hoverColor,
}) => {
   return (
      <ul
         onClick={() => setOpen({ color, hoverColor, day, dayId, open: true })}
         className="relative bg-transparent rounded-md space-y-4  before:absolute before:w-full before:h-full before:bg-gray-300 before:bg-opacity-5 before:blur-xl border-[2px] border-bordr1 group"
      >
         <li className="relative h-[150px] font-sofiaPro flex justify-center items-center overflow-hidden cursor-pointer">
            <span
               className={`absolute inset-0 flex justify-center items-center text-9xl font-extrabold ${color} opacity-30 transition-transform duration-300  group-hover:scale-0 group-hover:blur-sm`}
            >
               {day.slice(0, 3)}
            </span>
            <span
               className={`relative text-7xl  font-bold transition-transform duration-500 group-hover:text-8xl group-hover:scale-110 ${hoverColor}`}
            >
               {day.slice(0, 3)}
            </span>
         </li>
         <div className="w-full min-h-[50px] p-2  ">{children}</div>
      </ul>
   );
};

export default CalWeekBanner1;
