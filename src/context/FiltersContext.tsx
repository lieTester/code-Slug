import React, { createContext, useState } from "react";
import { FiltersContextType } from "@/types/contextTypes";
import {
   filterProp,
   ChildrenProp,
   listProp,
   topicProp,
   companieProp,
} from "@/types/index";

export const FiltersContext = createContext<FiltersContextType | undefined>(
   undefined
);
export const FiltersProvider = ({ children }: ChildrenProp) => {
   const [lists, setLists] = useState<listProp[]>([]);
   const [topics, setTopics] = useState<topicProp[]>([]);
   const [companies, setCompanies] = useState<companieProp[]>([]);
   const [isTopic, setIsTopic] = useState<boolean>(true);
   const difficulty = ["Easy", "Medium", "Hard"];
   const status = ["Todo", "Solved", "Attempted"];
   // above filter data management states ///////////////////////////////////
   const [filterValues, setFilterValues] = useState<filterProp>({});
   const [filterVisiblity, setFilterVisiblity] = useState<any | null>(null);
   return (
      <FiltersContext.Provider
         value={{
            lists,
            setLists,
            topics,
            setTopics,
            companies,
            setCompanies,
            isTopic,
            setIsTopic,
            difficulty,
            status,
            filterValues,
            setFilterValues,
            filterVisiblity,
            setFilterVisiblity,
         }}
      >
         {children}
      </FiltersContext.Provider>
   );
};
