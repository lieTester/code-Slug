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
      <div className="flex h-[95%] ">
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
