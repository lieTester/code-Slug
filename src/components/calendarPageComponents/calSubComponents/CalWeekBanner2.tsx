import React from "react";
import { ChildrenProp } from "@/types";

interface CalWeekBanner1Props extends ChildrenProp {
   color: string;
   hoverColor: string;
   day: string;
}

function CalWeekBanner2({
   children,
   color,
   hoverColor,
   day,
}: CalWeekBanner1Props) {
   return (
      <ul className="relative  bg-transparent rounded-md  space-y-4 before:absolute before:w-full before:h-full before:bg-white before:bg-opacity-5 before:blur-sm border-[2px] border-bordr1 group">
         <li
            className={`relative h-[150px] before:absolute before:w-full before:h-full ${color} before:opacity-70 font-sofiaPro text-center flex justify-center items-center rounded-lg shadow-lg overflow-hidden group `}
         >
            <span className="absolute inset-0 flex justify-center items-center text-9xl font-extrabold text-white opacity-30 transition-transform duration-500 group-hover:opacity-0 group-hover:scale-100">
               {day}
            </span>
            <span className="relative text-7xl text-white font-extrabold  transition-transform duration-300 group-hover:text-8xl group-hover:scale-110">
               {day}
            </span>
         </li>
         <li className="w-full min-h-[50px] p-2  ">{children}</li>
      </ul>
   );
}

export default CalWeekBanner2;
