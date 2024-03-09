import React, { useEffect, useRef } from "react";

function CalendarLandingSideBarSkeleton() {
   const block = (
      <div className="relative w-full rounded-md overflow-hidden bg-backg2">
         <div className="shadow rounded-md px-4 py-2 max-w-sm w-full mx-auto animate-pulse">
            <div className="animate-pulse flex space-x-4">
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
            <div className="h-4 mt-2 bg-slate-700 rounded w-[40%]"></div>
         </div>
      </div>
   );

   let sideBlocks = [];
   for (let i = 0; i < 3; i++) sideBlocks.push(block);
   return (
      <section className="relative w-full md:h-full md:w-[40%] lg:w-[30%] 2xl:w-[25%] mr-[10px] text-prim1 mb-4">
         <div className="relative w-full [&>*]:mb-2 [&>*]:pb-2 animate-pulse">
            {sideBlocks.map((block, index) => {
               return <div key={index}>{block}</div>;
            })}
         </div>
      </section>
   );
}

export default CalendarLandingSideBarSkeleton;
