// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
import { ProblemContext } from "@/context/ProblemsContext";
// component
import ListsLandingSkeleton from "@/pages/skeleton/ListLanding.skeleton";
import ListMaker from "@/components/ListMaker";
import ProblemFilters from "@/components/subcomponent/Filter/ProblemFilters";
import ListLandingBody from "./skeleton/ListLandingSub/ListLandingBody";

const ListsLanding: FC<SessionProp> = ({ session }) => {
   const sessionContext = useContext(SessionContext);
   const setSession = sessionContext?.setSession;

   useEffect(() => {
      if (setSession) {
         // console.log(session);
         setSession(session);
      }
   }, [session]);

   const problemContext = useContext(ProblemContext);
   const currentPageProblemSet = problemContext?.currentPageProblemSet;
   const setProblemSetLoading = problemContext?.setProblemSetLoading;
   const problemSetLoading = problemContext?.problemSetLoading;
   useEffect(() => {
      if (
         currentPageProblemSet &&
         currentPageProblemSet?.length > 0 &&
         setProblemSetLoading
      ) {
         // console.log(problemSetLoading, currentPageProblemSet);
         setTimeout(() => {
            setProblemSetLoading(false);
            // console.log("worked");
         }, 300); // Check if problems array is not empty
      }
   }, [currentPageProblemSet]);
   return (
      <>
         <section className="w-screen h-screen  overflow-y-auto">
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] h-[100%] mx-auto   pt-20 pb-20 font-baloo ">
               <ProblemFilters />
               {problemSetLoading ? <ListLandingBody /> : <ListMaker />}
            </div>
         </section>
      </>
   );
};

export default ListsLanding;
