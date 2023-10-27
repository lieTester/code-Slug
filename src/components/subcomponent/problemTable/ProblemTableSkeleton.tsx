import React from "react";

const ProblemTableSkeleton = () => {
   const skeletonRows = Array.from({ length: 15 }, (_, index) => (
      <tr
         key={index}
         className={`${
            index % 2 === 1 && "bg-prim2 "
         } text-seco1 [&>*]:animate-pulse`}
      >
         <td className="">
            <div className="h-4 w-4 bg-seco2 rounded-md mx-auto"></div>
         </td>
         <td className="py-2 px-4">
            <div className="h-6  min-w-[300px] 2xl:w-auto bg-seco2 rounded-md"></div>
         </td>
         <td className="py-2 px-4 ">
            <div className="h-6 w-16 bg-seco2 rounded-md mx-auto"></div>
         </td>
         <td className="py-2 px-4 ">
            <div className="h-6 w-24 bg-seco2 rounded-md mx-auto"></div>
         </td>
         <td className="py-2 px-4 ">
            <div className="h-6 w-24 bg-seco2 rounded-md mx-auto"></div>
         </td>
      </tr>
   ));

   return <tbody>{skeletonRows}</tbody>;
};

export default ProblemTableSkeleton;
