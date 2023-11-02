import React, { useContext } from "react";

import { ProblemContext } from "@/context/ProblemsContext";

const ProblemTableSkeleton = () => {
   // problem context
   const problemContext = useContext(ProblemContext);
   const page = problemContext?.page;

   const skeletonRows = Array.from({ length: page.pageSize }, (_, index) => (
      <tr
         key={index}
         className={`${
            index % 2 === 1 && "bg-prim2 "
         } text-seco1 [&>*]:animate-pulse`}
      >
         <td className="">
            <div className="h-4 w-4 bg-seco1 rounded-md mx-auto"></div>
         </td>
         <td className="py-2 px-4">
            <div className="h-6  min-w-[300px] 2xl:w-auto bg-seco1 rounded-md"></div>
         </td>
         <td className="py-2 px-4 ">
            <div className="h-6 w-16 bg-seco1 rounded-md mx-auto"></div>
         </td>
         <td className="py-2 px-4 ">
            <div className="h-6 w-24 bg-seco1 rounded-md mx-auto"></div>
         </td>
         <td className="py-2 px-4 ">
            <div className="h-6 w-24 bg-seco1 rounded-md mx-auto"></div>
         </td>
      </tr>
   ));

   return <tbody>{skeletonRows}</tbody>;
};

export default ProblemTableSkeleton;
