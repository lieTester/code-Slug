import React from "react";
import TopicsSkeleton from "@/components/skeleton/calenderlanding/CalendarWeeklyPlans/TopicsSkeleton";

function CalendarApplyWeeklyPlanBaseSkeleton() {
   return (
      <section className="w-full min-h-full md:w-[60%] lg:w-[70%] 2xl:w-[75%] rounded-lg">
         {/* Skeleton Header */}
         <div className="relative h-[100px] mb-8 flex justify-center items-center  bg-black bg-opacity-50 rounded-md animate-pulse border-[2px] border-bordr1 ">
            <span className="w-[50%] h-12 bg-slate-700 rounded-md">
               {/* Placeholder for header text */}
            </span>
            <div className="absolute top-2 right-2 flex justify-between items-center">
               <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse mr-2"></div>
               <div className="w-20 h-8 bg-slate-700 rounded-sm animate-pulse"></div>
            </div>
         </div>

         {/* Skeleton Body */}
         <div
            className={`gap-4 w-full h-full columns-1 sm:columns-2 md:columns-1 lg:columns-2   space-y-4  [&>*]:break-inside-avoid [&>*]:overflow-hidden `}
         >
            {[...Array(3)].map((_, index) => (
               <div
                  key={index}
                  className="relative h-[250px] bg-black bg-opacity-50 rounded-md   space-y-4 animate-pulse border-[2px] border-bordr1 "
               >
                  <div className="w-[80%] mt-4 mx-auto animate-pulse flex space-x-4">
                     <div className="flex-1 space-y-3 py-1">
                        <div className="space-y-3">
                           <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                              <div className="h-2 rounded col-span-1"></div>
                           </div>
                           <div className="h-2 bg-slate-700 rounded"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                           <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                     </div>
                  </div>
                  <div className="w-[80%]  mx-auto h-[calc(100%-100px)] ">
                     <div className="h-full flex items-center">
                        <TopicsSkeleton count={6} topicHeight="h-4  " />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}

export default CalendarApplyWeeklyPlanBaseSkeleton;
