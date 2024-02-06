import { Session } from "next-auth";
import {
   companieProp,
   filterProp,
   listProp,
   ProblemsProp,
   topicProp,
} from "@/types/index";

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
   currentListDetail: { isPublic?: boolean; id?: string };
   setCurrentListDetail: React.Dispatch<
      React.SetStateAction<{
         isPublic?: boolean;
         id?: string;
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

// FiltersContext.tsx
export type FiltersContextType = {
   lists: listProp[];
   setLists: React.Dispatch<React.SetStateAction<listProp[]>>;
   topics: topicProp[];
   setTopics: React.Dispatch<React.SetStateAction<topicProp[]>>;
   companies: companieProp[];
   setCompanies: React.Dispatch<React.SetStateAction<companieProp[]>>;
   isTopic: boolean;
   setIsTopic: React.Dispatch<React.SetStateAction<boolean>>;
   difficulty: string[];
   status: string[];
   filterValues: filterProp;
   setFilterValues: React.Dispatch<React.SetStateAction<filterProp>>;
   filterVisiblity: any | null;
   setFilterVisiblity: React.Dispatch<React.SetStateAction<any | null>>;
};
