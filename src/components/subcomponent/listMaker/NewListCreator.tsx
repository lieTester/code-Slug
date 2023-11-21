import React, { useState } from "react";

// type
import { ProblemsProp } from "@/types/index";
import TruncateTags from "../problemTable/TruncateTag";

import {
   giveMyStatus,
   statusColor,
   difficultyColor,
   handleDrop,
} from "@/functions/Utils";
const NewListCreator: React.FC<{
   baseProblemList: ProblemsProp[];
   newProblemList: ProblemsProp[];
   setBaseProblemList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
   setNewProblemList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
}> = ({
   baseProblemList,
   newProblemList,
   setBaseProblemList,
   setNewProblemList,
}) => {
   ////////////////////////////////////////////////////////////////////////
   //////////////////////////////// main functions////////////////////////////////
   ////////////////////////////////////////////////////////////////////////

   const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      problem: ProblemsProp
   ) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(problem));
   };

   return (
      <div
         className="w-2/3 bg-black/10  p-2 border-seco2 border-[1px] rounded-md ml-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-seco1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-prim2 "
         onDrop={(e) => {
            handleDrop(
               e,
               newProblemList,
               setNewProblemList,
               baseProblemList,
               setBaseProblemList
            );
         }}
         onDragOver={(e) => {
            e.preventDefault();
            // console.log(e.clientX, e.clientY);
         }}
      >
         <div className="grid grid-cols-3 gap-2 col-span-3">
            {newProblemList &&
               newProblemList.map((problem, index) => (
                  <div
                     key={problem.id}
                     draggable
                     onDragStart={(e) => handleDragStart(e, problem)}
                     className={`${
                        index % 2 === 1
                           ? " bg-prim2  "
                           : " bg-black bg-opacity-10 bg-blur-lg "
                     }  w-full h-fit block  rounded-md px-3 py-2 text-prim2   cursor-pointer border-seco2 border-[1px] truncate`}
                  >
                     <ul className="flex justify-between">
                        <h1
                           title={problem.title}
                           className="truncate text-prim1  font-medium"
                        >
                           {problem.title}
                        </h1>
                        <li className="flex items-center">
                           <span
                              className={`${difficultyColor(
                                 problem.difficulty
                              )} mx-2`}
                           >
                              {problem.difficulty}
                           </span>
                           <span
                              className={`${statusColor(
                                 problem.status || ""
                              )} `}
                           >
                              {problem?.status && giveMyStatus(problem?.status)}
                           </span>
                        </li>
                     </ul>
                     <ul className="mt-1">
                        {problem?.tags && (
                           <TruncateTags
                              tags={problem.tags}
                              maxWidth={200}
                              ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                              liCss="relative rounded-full bg-seco1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
                           />
                        )}
                     </ul>
                  </div>
               ))}
         </div>
      </div>
   );
};

export default NewListCreator;
