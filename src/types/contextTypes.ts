import { Session } from "next-auth";
import { ProblemsProp } from "@/types/index";

// SessionContext.tsx
export type SessionContextType = {
   session: any;
   setSession: React.Dispatch<React.SetStateAction<any>>;
};

// ProblemContext.tsx
export type ProblemContextType = {
   currentListProblems: ProblemsProp[];
   setCurrentListProblems: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
   userProblemStatus: String[];
   setUserProblemStatus: React.Dispatch<React.SetStateAction<String[]>>;
   currentPageProblemSet: ProblemsProp[];
   setCurrentPageProblemSet: React.Dispatch<
      React.SetStateAction<ProblemsProp[]>
   >;
   page: any;
   setPage: React.Dispatch<React.SetStateAction<any>>;
};
