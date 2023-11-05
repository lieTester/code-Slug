import { ProblemsProp } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import TruncateTags from "../problemTable/TruncateTag";
import { giveMyStatus, statusColor, difficultyColor } from "@/functions/Utils";

const DraggedProblem: React.FC<{
   draggedProblem: ProblemsProp;
   cursorPosition: { x: number; y: number };
}> = ({ draggedProblem, cursorPosition }) => {
   const [componentStyle, setcomponentStyle] = useState<any>({
      top: `${cursorPosition.y}px`,
      left: `${cursorPosition.x}px`,
      pointerEvents: "none", // Allows mouse events to pass through
   });
   const draggedItem = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      // console.log(cursorPosition);
      setcomponentStyle({
         top: cursorPosition.y,
         left: cursorPosition.x - 100,
         pointerEvents: "none", // Allows mouse events to pass through
      });
   }, [cursorPosition]);

   return (
      <div
         ref={draggedItem}
         className={`${!draggedProblem} absolute bg-prim2 
                  w-[300px] h-fit block mx-auto mb-2 rounded-md px-3 py-2 text-prim2 cursor-pointer border-seco2 border-[1px] z-30`}
         style={componentStyle}
      >
         <ul className="flex justify-between">
            <h1
               title={draggedProblem.title}
               className="truncate text-prim1  font-medium"
            >
               {draggedProblem.title}
            </h1>
            <li className="flex items-center">
               <span
                  className={`${difficultyColor(
                     draggedProblem.difficulty
                  )} mx-2`}
               >
                  {draggedProblem.difficulty}
               </span>
               <span className={`${statusColor(draggedProblem.status || "")} `}>
                  {draggedProblem?.status &&
                     giveMyStatus(draggedProblem?.status)}
               </span>
            </li>
         </ul>
         <ul className="mt-1">
            {draggedProblem?.tags && (
               <TruncateTags
                  tags={draggedProblem.tags}
                  maxWidth={350}
                  ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                  liCss="relative rounded-full bg-seco1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
               />
            )}
         </ul>
      </div>
   );
};

export default DraggedProblem;
