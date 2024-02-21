import React from "react";

function ListLandingSideBar() {
   const my_div = (
      <div className="w-full flex items-center justify-between animate-pulse ">
         <div>
            <div className="h-2.5 bg-slate-700 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-700 rounded-full "></div>
         </div>
         <div className="h-2.5 bg-slate-700 rounded-full  w-12"></div>
      </div>
   );
   const baseListHolder = [];
   for (let i = 0; i < 10; i++) {
      baseListHolder.push(my_div);
   }

   return (
      <div className="w-full h-full md:w-[40%] lg:w-[30%] 2xl-[25%]  rounded-md ">
         <div className="w-full pointer-events-auto h-full overflow-y-auto  [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg2">
            {baseListHolder.map((children, index) => {
               return (
                  <div
                     key={index}
                     role="status"
                     className="relative bg-backg2   w-[99%] mr-auto mb-2 rounded-md px-3 py-2 text-prim2   cursor-pointer border-bordr1 border-[1px] md:p-6"
                  >
                     {children}
                  </div>
               );
            })}
         </div>
      </div>
   );
}

export default ListLandingSideBar;
