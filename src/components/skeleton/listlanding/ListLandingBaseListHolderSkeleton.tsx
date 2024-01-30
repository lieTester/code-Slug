import React from "react";

const ListLandingBaseListHolderSkeleton = () => {
   const my_div = (
      <div className="flex items-center justify-between animate-pulse ">
         <div>
            <div className="h-2.5 bg-front1 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-front1 rounded-full "></div>
         </div>
         <div className="h-2.5 bg-front1 rounded-full  w-12"></div>
      </div>
   );
   const baseListHolder = [];
   for (let i = 0; i < 10; i++) {
      baseListHolder.push(my_div);
   }

   return (
      <div className="w-1/3 pointer-events-auto h-full overflow-y-auto px-1 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg2">
         {baseListHolder.map((children, index) => {
            return (
               <div
                  key={index}
                  role="status"
                  className=" relative bg-backg2 w-[98%] mx-auto px-3 py-2 text-prim2   cursor-pointer max-w-md p-4 mb-2 space-y-4 border border-bordr1 divide-y divide-seco1 rounded shadow  md:p-6 "
               >
                  {children}
               </div>
            );
         })}
      </div>
   );
};

export default ListLandingBaseListHolderSkeleton;
