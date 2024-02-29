import React from "react";
import { CalWeekBannerProps } from "@/types";

const CalWeekBanner2: React.FC<CalWeekBannerProps> = ({
   day,
   dayId,
   color,
   setOpen,
   children,
   hoverColor,
}) => {
   return (
      <div
         onClick={() => setOpen({ color, hoverColor, day, dayId, open: true })}
         className="relative  bg-transparent rounded-md  space-y-4 cursor-pointer before:absolute before:w-full before:h-full before:bg-white before:bg-opacity-5 before:blur-sm border-[2px] border-bordr1 group"
      >
         <div
            className={`relative h-[150px] cursor-pointer font-sofiaPro text-center flex justify-center items-center rounded-lg shadow-lg overflow-hidden before:absolute before:w-full before:h-full ${color} before:opacity-70 group `}
         >
            <span className="absolute inset-0 flex justify-center items-center text-9xl font-extrabold text-white opacity-30 transition-transform duration-500 group-hover:opacity-0 group-hover:scale-100">
               {day.slice(0, 3)}
            </span>
            <span className="relative text-7xl text-white font-extrabold  transition-transform duration-300 group-hover:text-8xl group-hover:scale-110">
               {day.slice(0, 3)}
            </span>
         </div>
         <div className="w-full min-h-[50px] p-2  ">{children}</div>
      </div>
   );
};

export default CalWeekBanner2;
