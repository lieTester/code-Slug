// react, next
import { FC, useEffect, useContext, useState } from "react";
// types
import { SessionProp } from "@/types/index";
// context
import { SessionContext } from "@/context/SessionContext";
import { ProblemContext } from "@/context/ProblemsContext";
// component
import ListMaker from "@/components/ListMaker";
import ProblemFilters from "@/components/subcomponent/Filter/ProblemFilters";
import ListLandingBodySkeleton from "@/components/skeleton/listlanding/ListLandingBodySkeleton";

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
            setProblemSetLoading({ loading: false });
            console.log("worked");
         }, 1000); // Check if problems array is not empty
      }
   }, [currentPageProblemSet]);

   return (
      <>
         <section className="w-screen min-h-screen h-full py-20  overflow-y-auto">
            <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] h-[100%] mx-auto font-baloo ">
               <ProblemFilters />
               {problemSetLoading?.loading &&
               problemSetLoading?.value === "list" ? (
                  <ListLandingBodySkeleton />
               ) : (
                  <ListMaker />
               )}
            </div>
         </section>
      </>
   );
};

export default ListsLanding;
