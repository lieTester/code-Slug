import React, { useState } from "react";

// type
import { ProblemsProp } from "@/types/index";

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
   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
   };
   const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      problem: ProblemsProp
   ) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(problem));
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
         className="w-2/3"
         onDrop={(e) =>
            handleDrop(
               e,
               newProblemList,
               setNewProblemList,
               baseProblemList,
               setBaseProblemList
            )
         }
         onDragOver={(e) => handleDragOver(e)}
      >
         <h2>New List Creator</h2>
         {newProblemList.map((problem) => (
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

export default NewListCreator;
