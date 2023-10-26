import { Session } from "next-auth";
import { ProblemsProp } from "@/types/index";

// SessionContext.tsx
export type SessionContextType = {
   session: any;
   setSession: React.Dispatch<React.SetStateAction<any>>;
};

// ProblemContext.tsx
export type ProblemContextType = {
   allproblems: ProblemsProp[];
   setAllProblems: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
   problemSet: ProblemsProp[];
   setProblemSet: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
   page: any;
   setPage: React.Dispatch<React.SetStateAction<any>>;
};
