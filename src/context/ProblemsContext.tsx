import React, { createContext, useState } from "react";
import { ProblemContextType } from "@/types/contextTypes";
import { ProblemsProp, ChildrenProp } from "@/types/index";

export const ProblemContext = createContext<ProblemContextType | undefined>(
   undefined
);
export const ProblemsProvider = ({ children }: ChildrenProp) => {
   const [allproblems, setAllProblems] = useState<ProblemsProp[]>([]);
   const [problemSet, setProblemSet] = useState<ProblemsProp[]>([]);
   const [page, setPage] = useState({
      currPage: 1,
      pageSize: 50,
      totalPages: 0,
   });
   return (
      <ProblemContext.Provider
         value={{
            allproblems,
            setAllProblems,
            problemSet,
            setProblemSet,
            page,
            setPage,
         }}
      >
         {children}
      </ProblemContext.Provider>
   );
};
