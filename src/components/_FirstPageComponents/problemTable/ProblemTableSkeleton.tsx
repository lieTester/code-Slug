import React, { useContext } from "react";

import { ProblemContext } from "@/context/ProblemsContext";

const ProblemTableSkeleton = () => {
   // problem context
   const problemContext = useContext(ProblemContext);
   const page = problemContext?.page;

   const skeletonRows = Array.from(
      { length: page?.pageSize || 50 },
      (_, index) => (
         <tr
            key={index}
            className={`${
               index % 2 === 1 && "bg-backg2 "
            } text-seco1 [&>*]:animate-pulse`}
         >
            <td className="">
               <div className="h-5 w-5 bg-slate-700 rounded-full mx-auto"></div>
            </td>
            <td className="py-3 px-4">
               <div className="h-5  min-w-[300px] 2xl:w-auto bg-slate-700 rounded-lg"></div>
            </td>
            <td className="py-3 px-4 ">
               <div className="h-5 w-16 bg-slate-700 rounded-lg mx-auto"></div>
            </td>
            <td className="py-3 px-4 ">
               <div className="h-5 w-24 bg-slate-700 rounded-lg mx-auto"></div>
            </td>
            <td className="py-3 px-4 ">
               <div className="h-5 w-24 bg-slate-700 rounded-lg mx-auto"></div>
            </td>
         </tr>
      )
   );

   return <tbody>{skeletonRows}</tbody>;
};

export default ProblemTableSkeleton;
