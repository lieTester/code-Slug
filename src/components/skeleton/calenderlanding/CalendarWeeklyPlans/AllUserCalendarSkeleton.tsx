import React from "react";

function AllUserCalendarSkeleton() {
   const my_div = (
      <div className="min-w-[220px] px-2  rounded-md overflow-hidden  backdrop-brightness-[.6] backdrop-blur-3xl flex items-center justify-between animate-pulse ">
         <div>
            <div className="h-2.5 bg-front1 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-front1 rounded-full "></div>
         </div>
         <div className="h-2.5 bg-front1 rounded-full  w-12"></div>
      </div>
   );
   const baseListHolder = [];
   for (let i = 0; i < 4; i++) {
      baseListHolder.push(my_div);
   }
   return <>{baseListHolder}</>;
}

export default AllUserCalendarSkeleton;
