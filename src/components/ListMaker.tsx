import React, { useState, useEffect, useContext } from "react";
import BaseListHolder from "./subcomponent/listMaker/BaseListHolder";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// type
import { ProblemsProp } from "@/types/index";
// component
import NewListCreator from "@/components/subcomponent/listMaker/NewListCreator";
import { ListLandingBaseListHolderSkeleton } from "@/pages/skeleton/ListLandingSkeleton";

const ListMaker: React.FC<{}> = ({}) => {
   const problemContext = useContext(ProblemContext);
   const filterdProblems = problemContext?.filterdProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const problemSetLoading = problemContext?.problemSetLoading;
   const [newProblemList, setNewProblemList] = useState<ProblemsProp[]>([]);
   const [
      checkPointForFilterListUpdateOnce,
      setCheckPointForFilterListUpdateOnce,
   ] = useState(false);
   const updateFilterListAfterFilterApplied = () => {
      const newFilterdProblemList = filterdProblems?.filter((problem) => {
         const res = newProblemList.find((item) => item.id === problem.id);
         return !res; // Return problems not found in newProblemList
      });
      setFilterdProblems && setFilterdProblems(newFilterdProblemList || []);
   };

   useEffect(() => {
      if (problemSetLoading?.value !== "list")
         setCheckPointForFilterListUpdateOnce(true);
      if (problemSetLoading?.loading && problemSetLoading?.value === "list") {
         setNewProblemList([]);
      } else if (
         problemSetLoading?.loading === false &&
         checkPointForFilterListUpdateOnce
      ) {
         // Call the update function when needed, not with a timeout
         setCheckPointForFilterListUpdateOnce(false);
         updateFilterListAfterFilterApplied();
      }
   }, [problemSetLoading]);

   return (
      <div className="flex h-[95%]  ">
         {filterdProblems &&
            setFilterdProblems &&
            (problemSetLoading?.loading ? (
               <ListLandingBaseListHolderSkeleton />
            ) : (
               <BaseListHolder
                  baseProblemList={filterdProblems}
                  newProblemList={newProblemList}
                  setBaseProblemList={setFilterdProblems}
                  setNewProblemList={setNewProblemList}
               />
            ))}
         {filterdProblems && setFilterdProblems && (
            <NewListCreator
               baseProblemList={filterdProblems}
               newProblemList={newProblemList}
               setBaseProblemList={setFilterdProblems}
               setNewProblemList={setNewProblemList}
            />
         )}
      </div>
   );
};

export default ListMaker;
