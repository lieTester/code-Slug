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
   const [filterdProblems, setFilterdProblems] = useState<ProblemsProp[]>([]);
   const [currentPageProblemSet, setCurrentPageProblemSet] = useState<
      ProblemsProp[]
   >([]);
   const [problemSetLoading, setProblemSetLoading] = useState<{
      loading: boolean;
      value?: string;
   }>({ loading: true, value: "list" });
   const [currentListDetail, setCurrentListDetail] = useState<{
      isPublic?: boolean;
      id?: string;
   }>({});

   const [page, setPage] = useState({
      currPage: 1,
      pageSize: 50,
      totalPages: 1,
   });
   return (
      <ProblemContext.Provider
         value={{
            // current list of problems for all problem or to fetch users specific List
            currentListProblems,
            setCurrentListProblems,
            // current list if exist in filter than its detail
            currentListDetail,
            setCurrentListDetail,
            // filterProblem is the one which will actually go to frontEndTables with user filter
            //and on removal will use currentList to alter bw filters
            filterdProblems,
            setFilterdProblems,
            // all problems appear on current page
            currentPageProblemSet,
            setCurrentPageProblemSet,
            // loading state for problems
            problemSetLoading,
            setProblemSetLoading,
            // page related fields
            page,
            setPage,
         }}
      >
         {children}
      </ProblemContext.Provider>
   );
};
