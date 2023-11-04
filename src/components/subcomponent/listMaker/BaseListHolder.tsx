import React, { useState, useRef, useEffect, useContext } from "react";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// type
import { ProblemsProp } from "@/types/index";

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
   const [displayedProblems, setDisplayedProblems] = useState(50);
   const listContainerRef = useRef<HTMLDivElement | null>(null);

   // Function to load more problems
   const loadMoreProblems = () => {
      if (baseProblemList && displayedProblems < baseProblemList.length) {
         setDisplayedProblems(displayedProblems + 5);
         console.log(displayedProblems);
      }
   };

   // Attach a scroll event listener to the div element
   useEffect(() => {
      const listContainer = listContainerRef.current;
      if (listContainer) {
         const handleScroll = () => {
            if (
               listContainer.scrollTop + listContainer.clientHeight ===
               listContainer.scrollHeight
            ) {
               console.log(
                  listContainer.scrollTop + listContainer.clientHeight,
                  listContainer.scrollHeight
               );
               loadMoreProblems();
            }
         };

         listContainer.addEventListener("scroll", handleScroll);

         return () => {
            listContainer.removeEventListener("scroll", handleScroll);
         };
      }
   }, [displayedProblems, baseProblemList]);

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
         className="w-1/3 h-full overflow-y-auto"
         onDrop={(e) =>
            handleDrop(
               e,
               baseProblemList,
               setBaseProblemList,
               newProblemList,
               setNewProblemList
            )
         }
         ref={listContainerRef}
         onDragOver={(e) => handleDragOver(e)}
      >
         <h2>List Problem</h2>
         {baseProblemList &&
            baseProblemList.slice(0, displayedProblems).map((problem) => (
               <div
                  key={problem.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, problem)}
               >
                  {problem.title}
               </div>
            ))}
      </div>
   );
};

export default BaseListHolder;
