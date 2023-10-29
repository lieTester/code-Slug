import React, { createContext, useState } from "react";
import { ProblemContextType } from "@/types/contextTypes";
import { ProblemsProp, ChildrenProp } from "@/types/index";

export const ProblemContext = createContext<ProblemContextType | undefined>(
   undefined
);
export const ProblemsProvider = ({ children }: ChildrenProp) => {
   const [currentListProblems, setCurrentListProblems] = useState<
      ProblemsProp[]
   >([]);
   const [userProblemStatus, setUserProblemStatus] = useState<String[]>([]);
   const [currentPageProblemSet, setCurrentPageProblemSet] = useState<
      ProblemsProp[]
   >([]);
   const [page, setPage] = useState({
      currPage: 1,
      pageSize: 50,
      totalPages: 0,
   });
   return (
      <ProblemContext.Provider
         value={{
            currentListProblems,
            setCurrentListProblems,
            userProblemStatus,
            setUserProblemStatus,
            currentPageProblemSet,
            setCurrentPageProblemSet,
            page,
            setPage,
         }}
      >
         {children}
      </ProblemContext.Provider>
   );
};
