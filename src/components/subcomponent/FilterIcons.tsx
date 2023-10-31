import React from "react";
import { filterProps } from "@/types/index";
import { AiOutlineCloseCircle } from "react-icons/ai";

const FilterIcons: React.FC<{
   filterValues: filterProps | undefined;
   fireFilter: (category: string, value: string) => void;
}> = ({ filterValues, fireFilter }) => {
   function getLiTag(category: string, value: string, css: string, indx: any) {
      return (
         <li
            key={indx}
            className={` flex items-center justify-between ${css} text-xs bg-extra2`}
         >
            <span className="mr-1 ml-1">{value}</span>
            <AiOutlineCloseCircle
               className="text-prim2 cursor-pointer hover:text-prim1"
               onClick={() => {
                  if (fireFilter) fireFilter(category, value);
               }}
            />
         </li>
      );
   }
   function returnFilterdata(filters: any) {
      // console.log(filters);
      let topics = filters?.topics?.map((value: string, indx: number) => {
         return getLiTag("topic", value, "rounded-full", indx);
      });
      let companies = filters?.companies?.map((value: string, indx: number) => {
         return getLiTag("company", value, "rounded-full", indx);
      });
      let status =
         filters?.status &&
         getLiTag("status", filters?.status, "rounded-sm", filters?.status);
      let list =
         filters?.list &&
         getLiTag("list", filters?.list, "rounded-sm", filters?.list);
      let dificulty =
         filters?.dificulty &&
         getLiTag(
            "dificulty",
            filters?.dificulty,
            "rounded-sm",
            filters?.dificulty
         );

      return [list, status, dificulty, topics, companies];
   }
   return <>{returnFilterdata(filterValues)}</>;
};

export default FilterIcons;
