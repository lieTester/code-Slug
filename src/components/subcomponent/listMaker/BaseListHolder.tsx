import React, { useRef, useEffect, useState } from "react";
import { ProblemsProp } from "@/types/index";
import TruncateTags from "../problemTable/TruncateTag";
import {
   giveMyStatus,
   statusColor,
   difficultyColor,
   handleDrop,
} from "@/functions/Utils";
const BaseListHolder: React.FC<{
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

   const [displayedProblems, setDisplayedProblems] = useState(50);
   const lastElementRef = useRef<HTMLDivElement | null>(null);

   const loadMoreProblems = () => {
      if (baseProblemList && displayedProblems < baseProblemList.length) {
         setDisplayedProblems(displayedProblems + 5);
      }
   };

   const observeLastElement = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && displayedProblems < baseProblemList.length) {
         loadMoreProblems();
      }
   };

   useEffect(() => {
      const observer = new IntersectionObserver(observeLastElement, {
         root: null,
         rootMargin: "0px",
         threshold: 0.1,
      });

      if (lastElementRef.current) {
         observer.observe(lastElementRef.current);
      }

      return () => {
         observer.disconnect();
      };
   }, [lastElementRef, displayedProblems, baseProblemList]);

   const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      problem: ProblemsProp,
      index: number
   ) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(problem));
      // e.dataTransfer.effectAllowed = "none";
   };

   return (
      <div
         className="w-1/2 md:w-1/3 pr-1 pointer-events-auto h-full overflow-y-auto  [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg2    "
         onDrop={(e) => {
            handleDrop(
               e,
               baseProblemList,
               setBaseProblemList,
               newProblemList,
               setNewProblemList
            );
         }}
         onDragOver={(e) => {
            e.preventDefault();
         }}
      >
         {baseProblemList &&
            baseProblemList
               .slice(0, displayedProblems)
               .map((problem, index) => (
                  <div
                     key={problem.id}
                     ref={
                        index === displayedProblems - 1 ? lastElementRef : null
                     }
                     draggable
                     onDragStart={(e) => handleDragStart(e, problem, index)}
                     className={`relative bg-backg2   w-[98%] mx-auto mb-2 rounded-md px-3 py-2 text-prim2   cursor-pointer border-bordr1 border-[1px] truncate`}
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
                              maxWidth={350}
                              ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                              liCss="relative rounded-full bg-front1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
                           />
                        )}
                     </ul>
                  </div>
               ))}
      </div>
   );
};

export default BaseListHolder;
