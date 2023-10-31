import { filterProps } from "@/types/index";

export const searchFilter = async (value: string, sortedList: any) => {
   // Filter the items based on the search term and sort by title
   sortedList = sortedList
      .filter((item: any) =>
         item.title.toLowerCase().includes(value.toLowerCase())
      )
      .sort((a: any, b: any) => a.title.localeCompare(b.title));
   // console.log(sortedList);
   return { sortedList };
};

export const applyFilter = async (
   filterValues: any,
   filteredProblemsList: any
) => {
   // console.log(filterValues);
   if (filterValues?.topics) {
      filterValues.topics.forEach((value: string) => {
         filteredProblemsList = filteredProblemsList.filter((problem: any) => {
            const res = problem.tags.some((topic: string) => topic === value);
            if (res) {
               return problem;
            }
         });
      });
   }
   if (filterValues?.companies) {
      filterValues.companies.forEach((value: string) => {
         filteredProblemsList = filteredProblemsList.filter((problem: any) => {
            const res = problem.companies.some(
               (company: string) => company === value
            );
            if (res) {
               return problem;
            }
         });
      });
   }
   if (filterValues?.status) {
      filteredProblemsList = filteredProblemsList.filter((problem: any) => {
         if (problem.status === filterValues?.status.toLowerCase()) {
            return problem;
         }
      });
   }
   if (filterValues?.difficulty) {
      filteredProblemsList = filteredProblemsList.filter((problem: any) => {
         if (problem.difficulty === filterValues?.difficulty) {
            return problem;
         }
      });
   }
   if (filterValues?.search) {
      const { sortedList } = await searchFilter(
         filterValues?.search,
         filteredProblemsList
      );
      // console.log(sortedList);
      filteredProblemsList = sortedList;
   }
   return { filteredProblemsList };
};

export const addFilter = async (
   category: string,
   value: string,
   filterValues: any,
   filteredProblemsList: any
) => {
   filterValues = filterValues === undefined ? {} : filterValues;

   if (category === "topic") {
      if (filterValues?.topics) {
         filterValues.topics = Array.from(
            new Set([...filterValues.topics, value])
         );
      } else {
         filterValues.topics = [value];
      }
   } else if (category === "company") {
      if (filterValues?.companies) {
         filterValues.companies = Array.from(
            new Set([...filterValues.companies, value])
         );
      } else {
         filterValues.companies = [value];
      }
   } else if (category === "search") {
      if (value.length === 0) delete filterValues.search;
      else filterValues.search = value;
   } else if (category === "list") filterValues.list = value;
   else if (category === "status") filterValues.status = value;
   else if (category === "difficulty") filterValues.difficulty = value;

   const response = await applyFilter(filterValues, filteredProblemsList);
   // console.log(response.filteredProblemsList);
   return { filterValues, filteredProblemsList: response.filteredProblemsList };
};

export const removeFilter = async (
   category: string,
   value: string,
   filterValues: any,
   filteredProblemsList: any
) => {
   // console.log(category, value);
   if (category === "topic") {
      filterValues.topics = filterValues.topics.filter(
         (item: string) => item !== value
      );
   } else if (category === "company") {
      filterValues.companies = filterValues.companies.filter(
         (item: string) => item !== value
      );
   } else if (
      category === "list" ||
      category === "status" ||
      category === "difficulty" ||
      category === "search"
   ) {
      delete filterValues[category];
   }
   const response = await applyFilter(filterValues, filteredProblemsList);
   // console.log(response.filteredProblemsList);
   return { filterValues, filteredProblemsList: response.filteredProblemsList };
};
