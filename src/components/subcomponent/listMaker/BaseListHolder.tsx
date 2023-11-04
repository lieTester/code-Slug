import React, { useRef, useEffect, useState } from "react";
import { ProblemsProp } from "@/types/index";
import TruncateTags from "../problemTable/TruncateTag";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";
import { IoIosCodeWorking } from "react-icons/io";

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
   //////////////////////////////// UTILS
   ////////////////////////////////////////////////////////////////////////
   const difficultyColor = (val: String) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   const statusColor = (val: String) => {
      if (val === "solved") return "text-easy";
      else if (val === "attempted") return "text-medium";
      return "text-prim1";
   };

   const giveMyStatus = (status: string) => {
      if (status === "solved")
         return (
            <BsCheck2Circle
               className={`mr-1 text-[18px]  ${statusColor(status)}`}
            />
         );
      else if (status === "attempted")
         return (
            <IoIosCodeWorking
               className={`mr-1 text-[20px]  ${statusColor(status)}`}
            />
         );
      return <BsCalendarMinus className={`mr-1  ${statusColor(status)}`} />;
   };

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
      problem: ProblemsProp
   ) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(problem));
   };

   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
   };

   const handleDrop = (
      e: React.DragEvent<HTMLDivElement>,
      targetList: ProblemsProp[],
      setTargetList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>,
      previousList: ProblemsProp[],
      setPreviousList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>
   ) => {
      e.preventDefault();
      const droppedProblem = JSON.parse(
         e.dataTransfer.getData("text/plain")
      ) as ProblemsProp;

      // Check if the problem already exists in the targetList
      if (targetList.some((p) => p.id === droppedProblem.id)) {
         return;
      }

      // Remove the problem from the source list (previousList)
      const updatedPreviousList = previousList.filter(
         (p) => p.id !== droppedProblem.id
      );
      setPreviousList(updatedPreviousList);

      // Add the problem to the target list (targetList)
      setTargetList([...targetList, droppedProblem]);
   };

   return (
      <div
         className="w-1/3 h-full overflow-y-auto  [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-seco1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-prim2    "
         onDrop={(e) =>
            handleDrop(
               e,
               baseProblemList,
               setBaseProblemList,
               newProblemList,
               setNewProblemList
            )
         }
         onDragOver={(e) => handleDragOver(e)}
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
                     onDragStart={(e) => handleDragStart(e, problem)}
                     className={`${
                        index % 2 === 1
                           ? " bg-prim2  "
                           : " bg-black bg-opacity-10 bg-blur-lg "
                     }  w-[98%] mx-auto mb-2 rounded-md px-3 py-2 text-prim2   cursor-pointer border-seco2 border-[1px]`}
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
                              )} mr-1`}
                           >
                              {problem.difficulty}
                           </span>
                           <span
                              className={`${statusColor(
                                 problem.status || ""
                              )} flex items-center`}
                           >
                              {problem?.status && giveMyStatus(problem?.status)}
                              {problem?.status &&
                                 problem.status.charAt(0).toUpperCase() +
                                    problem.status.slice(1)}
                           </span>
                        </li>
                     </ul>
                     <ul className="mt-1">
                        {problem?.tags && (
                           <TruncateTags
                              tags={problem.tags}
                              maxWidth={350}
                              ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                              liCss="relative rounded-full bg-seco1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
                           />
                        )}
                     </ul>
                  </div>
               ))}
      </div>
   );
};

export default BaseListHolder;