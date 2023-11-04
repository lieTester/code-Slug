import React, { useState, useRef, useEffect, useContext } from "react";
import BaseListHolder from "./subcomponent/listMaker/BaseListHolder";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// type
import { ProblemsProp } from "@/types/index";
import NewListCreator from "./subcomponent/listMaker/NewListCreator";
const ListMaker = () => {
   const problemContext = useContext(ProblemContext);
   const filterdProblems = problemContext?.filterdProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const [newList, setNewList] = useState<ProblemsProp[]>([]);
   return (
      <div className="flex space-x-4 h-[500px] bg-red-300">
         {filterdProblems && setFilterdProblems && (
            <BaseListHolder
               baseProblemList={filterdProblems}
               newProblemList={newList}
               setBaseProblemList={setFilterdProblems}
               setNewProblemList={setNewList}
            />
         )}
         {filterdProblems && setFilterdProblems && (
            <NewListCreator
               baseProblemList={filterdProblems}
               newProblemList={newList}
               setBaseProblemList={setFilterdProblems}
               setNewProblemList={setNewList}
            />
         )}
      </div>
   );
};

export default ListMaker;

// const ParentComponent: React.FC = () => {
//    const initialProblems: Problem[] = [
//       { id: "1", content: "Problem 1" },
//       { id: "2", content: "Problem 2" },
//       { id: "3", content: "Problem 3" },
//       { id: "4", content: "Problem 4" },
//    ];

//    const [problems, setProblems] = useState<Problem[]>(initialProblems);
//    const [newList, setNewList] = useState<Problem[]>([]);

//    const handleDragStart = (
//       e: React.DragEvent<HTMLDivElement>,
//       problem: Problem
//    ) => {
//       e.dataTransfer.setData("text/plain", JSON.stringify(problem));
//    };

//    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//    };

//    const handleDrop = (
//       e: React.DragEvent<HTMLDivElement>,
//       targetList: Problem[],
//       setTargetList: React.Dispatch<React.SetStateAction<Problem[]>>,
//       previousList: Problem[],
//       setPreviousList: React.Dispatch<React.SetStateAction<Problem[]>>
//    ) => {
//       e.preventDefault();
//       const droppedProblem = JSON.parse(
//          e.dataTransfer.getData("text/plain")
//       ) as Problem;

//       // Check if the problem already exists in the targetList
//       if (targetList.some((p) => p.id === droppedProblem.id)) {
//          return;
//       }

//       // Remove the problem from the source list (previousList)
//       const updatedPreviousList = previousList.filter(
//          (p) => p.id !== droppedProblem.id
//       );
//       setPreviousList(updatedPreviousList);

//       // Add the problem to the target list (targetList)
//       setTargetList([...targetList, droppedProblem]);
//    };

//    return (
//       <div className="flex bg-slate-300">
//          <div
//             className="w-1/3"
//             onDrop={(e) =>
//                handleDrop(e, problems, setProblems, newList, setNewList)
//             }
//             onDragOver={(e) => handleDragOver(e)}
//          >
//             <h2>List Problem</h2>
//             {problems.map((problem) => (
//                <div
//                   key={problem.id}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, problem)}
//                >
//                   {problem.content}
//                </div>
//             ))}
//          </div>
//          <div
//             className="w-2/3"
//             onDrop={(e) =>
//                handleDrop(e, newList, setNewList, problems, setProblems)
//             }
//             onDragOver={(e) => handleDragOver(e)}
//          >
//             <h2>New List Creator</h2>
//             {newList.map((problem) => (
//                <div
//                   key={problem.id}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, problem)}
//                >
//                   {problem.content}
//                </div>
//             ))}
//          </div>
//       </div>
//    );
// };

// export default ParentComponent;
