import React from "react";

const ListLandingNewListCreaterSkeleton = () => {
   const my_div = (
      <div className="flex items-center justify-between animate-pulse ">
         <div>
            <div className="h-2.5 bg-front1 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-front1 rounded-full "></div>
         </div>
         <div className="h-2.5 bg-front1 rounded-full  w-12"></div>
      </div>
   );
   const newListCreater = [];
   for (let i = 0; i < 7; i++) {
      newListCreater.push(my_div);
   }
   return (
      <div className="w-2/3 bg-black/10  p-2 border-bordr1 border-[1px] rounded-md ml-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg2 ">
         <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 ">
            {newListCreater.map((children, index) => {
               return (
                  <div
                     key={index}
                     role="status"
                     className="  max-w-md p-4 mb-2 space-y-4 border border-bordr1 divide-y divide-seco1 rounded shadow  md:p-6 "
                  >
                     {children}
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default ListLandingNewListCreaterSkeleton;
