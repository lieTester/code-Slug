import { Session } from "next-auth";
import { ProblemsProp } from "@/types/index";

// SessionContext.tsx
export type SessionContextType = {
   session: any;
   setSession: React.Dispatch<React.SetStateAction<any>>;
};

// ProblemContext.tsx
export type ProblemContextType = {
   problemSetLoading: {
      loading: boolean;
      value?: string;
   };
   setProblemSetLoading: React.Dispatch<
      React.SetStateAction<{
         loading: boolean;
         value?: string;
      }>
   >;
   currentListProblems: ProblemsProp[];
   setCurrentListProblems: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
   filterdProblems: ProblemsProp[];
   setFilterdProblems: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;

   currentPageProblemSet: ProblemsProp[];
   setCurrentPageProblemSet: React.Dispatch<
      React.SetStateAction<ProblemsProp[]>
   >;
   page: any;
   setPage: React.Dispatch<React.SetStateAction<any>>;
};
