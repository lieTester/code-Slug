import React from "react";

function AllUserCalendarSkeleton() {
   const my_div = (
      <>
         <div>
            <div className="h-2.5 bg-slate-700 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-700 rounded-full "></div>
         </div>
         <div className="h-2.5 bg-slate-700 rounded-full  w-12"></div>
      </>
   );
   const baseListHolder = [];
   for (let i = 0; i < 4; i++) {
      baseListHolder.push(my_div);
   }
   return (
      <>
         {baseListHolder.map((div, index) => {
            return (
               <div
                  className="min-w-[220px] px-2  rounded-md overflow-hidden bg-black bg-opacity-40 flex items-center justify-between animate-pulse "
                  key={index}
               >
                  {div}
               </div>
            );
         })}
      </>
   );
}

export default AllUserCalendarSkeleton;
