import { filterProps } from "@/types/index";
export const addFilter = async (
   category: string,
   value: string,
   filters: any
) => {
   filters = filters === undefined ? {} : filters;

   if (category === "topic") {
      if (filters?.topics) {
         filters.topics = Array.from(new Set([...filters.topics, value]));
      } else {
         filters.topics = [value];
      }
   } else if (category === "company") {
      if (filters?.companies) {
         filters.companies = Array.from(new Set([...filters.companies, value]));
      } else {
         filters.companies = [value];
      }
   } else if (category === "list") filters.list = value;
   else if (category === "status") filters.status = value;
   else if (category === "dificulty") filters.dificulty = value;

   return { filters };
};

export const removeFilter = async (
   category: string,
   value: string,
   filters: any
) => {
   // console.log(category, value);
   if (category === "topic") {
      filters.topics = filters.topics.filter((item: string) => item !== value);
   } else if (category === "company") {
      filters.companies = filters.companies.filter(
         (item: string) => item !== value
      );
   } else if (
      category === "list" ||
      category === "status" ||
      category === "dificulty"
   ) {
      delete filters[category];
   }
   return { filters };
};
