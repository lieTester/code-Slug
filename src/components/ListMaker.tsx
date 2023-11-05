import React, { useState, useEffect, useContext } from "react";
import BaseListHolder from "./subcomponent/listMaker/BaseListHolder";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// type
import { ProblemsProp } from "@/types/index";
import NewListCreator from "./subcomponent/listMaker/NewListCreator";
import DraggedProblem from "./subcomponent/listMaker/DraggedProblem";
const ListMaker: React.FC<{}> = ({}) => {
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   const filterdProblems = problemContext?.filterdProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const [newList, setNewList] = useState<ProblemsProp[]>([]);
   useEffect(() => {
      setNewList([]);
   }, [currentListProblems]);

   const [draggedProblem, setDraggedProblem] = useState<ProblemsProp>();
   const renderDraggedItem = (draggedProbem: ProblemsProp | undefined) => {
      if (!draggedProbem) return null;
      return (
         <DraggedProblem
            cursorPosition={cursorPosition}
            draggedProblem={draggedProbem}
         />
      );
   };
   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

   const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      // Update the cursor position whenever the mouse moves
      // console.log(e.clientX, e.clientY);
      setCursorPosition({ x: e.clientX, y: e.clientY });
   };
   return (
      <div className="flex h-[95%]  " onDragOver={(e) => handleMouseMove(e)}>
         {draggedProblem && (
            <DraggedProblem
               cursorPosition={cursorPosition}
               draggedProblem={draggedProblem}
            />
         )}
         {filterdProblems && setFilterdProblems && (
            <BaseListHolder
               baseProblemList={filterdProblems}
               newProblemList={newList}
               setBaseProblemList={setFilterdProblems}
               setNewProblemList={setNewList}
               setDraggedProbem={setDraggedProblem}
            />
         )}
         {filterdProblems && setFilterdProblems && (
            <NewListCreator
               baseProblemList={filterdProblems}
               newProblemList={newList}
               setBaseProblemList={setFilterdProblems}
               setNewProblemList={setNewList}
               setDraggedProbem={setDraggedProblem}
            />
         )}
      </div>
   );
};

export default ListMaker;
