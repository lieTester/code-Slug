import React from "react";

export const DotLoader = () => {
   return (
      <div className="w-full h-full flex items-center justify-center  ">
         <div className="flex space-x-2 animate-pulse">
            <div className="dot delay-100"></div>
            <div className="dot delay-200"></div>
            <div className="dot delay-300"></div>
         </div>
      </div>
   );
};
