import React from "react";

const CalendarWeeklyPlansBaseSkeleton = () => {
   return (
      <section className="w-full h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1 rounded-lg">
         {/* Header Skeleton */}
         <div className="w-full h-[30%] rounded-t-lg overflow-y-auto border-[2px] border-secod1">
            <span className="w-full h-[45px] p-2 pl-4 block bg-backg2 font-sofiaPro font-extrabold text-red-300 text-lg">
               sdfsd
            </span>

            {/* Skeleton Loader for Calendar List */}
            <div className="w-full h-[calc(100%-45px)] flex flex-wrap p-2 overflow-y-auto space-y-2 animate-pulse">
               {Array.from({ length: 3 }).map((_, idx) => (
                  <ul
                     key={idx}
                     className="relative w-full flex min-w-[220px] max-w-[350px] p-1 rounded-md overflow-hidden bg-gray-200"
                  >
                     <li className="w-full pb-4">
                        <span className="font-sofiaPro block w-32 h-6 bg-gray-300 mb-2"></span>
                        <ul className="flex space-x-1 text-xs">
                           {Array.from({ length: 5 }).map((_, i) => (
                              <li
                                 key={i}
                                 className="bg-gray-300 h-6 w-8 rounded-md"
                              ></li>
                           ))}
                        </ul>
                     </li>
                     <li className="flex space-x-2">
                        <button className="bg-gray-300 h-10 w-10 rounded-full"></button>
                        <button className="bg-gray-300 h-10 w-10 rounded-full"></button>
                        <button className="bg-gray-300 h-10 w-10 rounded-full"></button>
                     </li>
                  </ul>
               ))}

               {/* Add Calendar Button Skeleton */}
               <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
            </div>
         </div>

         {/* Content Skeleton for Calendar Details */}
         <div className="w-full h-[70%] py-4 overflow-y-auto animate-pulse">
            <div className="gap-4 w-full columns-1 sm:columns-2 md:columns-1 lg:columns-2 xl:columns-3 space-y-4">
               {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                     key={idx}
                     className="w-full bg-gray-200 h-20 rounded-md"
                  ></div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default CalendarWeeklyPlansBaseSkeleton;
