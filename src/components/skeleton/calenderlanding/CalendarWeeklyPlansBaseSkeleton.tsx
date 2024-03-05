import React from "react";
import AllUserCalendarSkeleton from "./CalendarWeeklyPlans/AllUserCalendarSkeleton";
import { DotLoader } from "@/components/commonComponents/Loaders";

const CalendarWeeklyPlansBaseSkeleton = () => {
   return (
      <section className="w-full h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] font-baloo text-prim1 rounded-lg">
         {/* Header Skeleton */}
         <div className="w-full h-[30%] rounded-t-lg overflow-y-auto border-[2px] border-secod1 animate-pulse">
            <span className="w-[200px] h-[30px] my-2 ml-3 p-2 pl-4 block bg-slate-700 rounded-sm "></span>

            {/* Skeleton Loader for Calendar List */}
            <div className="w-full  h-[calc(100%-45px)] flex flex-wrap p-2 overflow-y-auto [&>*]:mr-1 [&>*]:mb-1  [&>*]:h-[55px] [&>*]:border-[2px] [&>*]:border-bordr1 ">
               <AllUserCalendarSkeleton />
               <div className="bg-slate-700 h-10 w-14 rounded-full"></div>
            </div>
         </div>

         {/* Content Skeleton for Calendar Details */}
         <div className="w-full h-[70%] py-4 overflow-y-auto animate-pulse">
            <DotLoader />
         </div>
      </section>
   );
};

export default CalendarWeeklyPlansBaseSkeleton;
