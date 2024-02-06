import React, { FC, useState, useEffect, useContext } from "react";
import BaseListHolder from "@/components/listPageComponents/listMaker/BaseListHolder";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// type
import { ProblemsProp } from "@/types/index";
// component
import NewListCreator from "@/components/listPageComponents/listMaker/NewListCreator";
import ListLandingBaseListHolderSkeleton from "@/components/skeleton/listlanding/ListLandingBaseListHolderSkeleton";
import ProblemFilters from "@/components/commonComponents/Filter/ProblemFilters";
import ListLandingBodySkeleton from "@/components/skeleton/listlanding/ListLandingBodySkeleton";

const ListMaker: FC = () => {
   const problemContext = useContext(ProblemContext);
   const currentPageProblemSet = problemContext?.currentPageProblemSet;
   const setProblemSetLoading = problemContext?.setProblemSetLoading;

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
      if (
         currentPageProblemSet &&
         currentPageProblemSet?.length > 0 &&
         setProblemSetLoading
      ) {
         // console.log(problemSetLoading, currentPageProblemSet);
         setTimeout(() => {
            setProblemSetLoading({ loading: false });
            // console.log("worked");
         }, 1000); // Check if problems array is not empty
      }
   }, [currentPageProblemSet]);

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
      <section className="relative h-full w-[65%] lg:w-[70%] 2xl:w-[75%] font-baloo  ">
         <div className="min-h-[250px] md:min-h-[160px] lg:md:min-h-[120px] xl:min-h-[14%]">
            {/* because the sam filter is used in first page where height directly
               assign in problem filter component will affect page
            */}
            <ProblemFilters />
         </div>
         {/* problem filter above has h[14%] */}
         {problemSetLoading?.loading && problemSetLoading?.value === "list" ? (
            <ListLandingBodySkeleton />
         ) : (
            <div className="relative h-[calc(100%-250px)] md:h-[calc(100%-160px)] lg:h-[calc(100%-120px)] xl:h-[86%] pl-2 ">
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
         )}
      </section>
   );
};

export default ListMaker;
