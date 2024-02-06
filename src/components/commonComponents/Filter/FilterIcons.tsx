import React from "react";
import { filterProp } from "@/types/index";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";
import { IoIosCodeWorking } from "react-icons/io";

const FilterIcons: React.FC<{
   filterValues: filterProp | undefined;
   fireFilter: (category: string, value: string) => void;
}> = ({ filterValues, fireFilter }) => {
   const difficultyColor = (val: String) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   const statusColor = (val: String) => {
      if (val === "Solved") return "text-easy";
      else if (val === "Attempted") return "text-medium";
      return "text-prim1";
   };
   const giveMyStatus = (status: String) => {
      if (status === "Solved")
         return (
            <BsCheck2Circle
               className={` text-[14px]  ${statusColor(status)}`}
            />
         );
      else if (status === "Attempted")
         return (
            <IoIosCodeWorking
               className={` text-[16px]  ${statusColor(status)}`}
            />
         );
      return <BsCalendarMinus className={`  ${statusColor(status)}`} />;
   };

   function getLiTag(category: string, value: string, css: string, indx: any) {
      return (
         <li
            key={indx}
            className={` flex items-center justify-between ${css} text-[13px] bg-secod3`}
         >
            {category === "status" && giveMyStatus(value)}
            <span className="mx-1 mt-[1px]">{value}</span>
            <AiOutlineCloseCircle
               className="text-prim2 cursor-pointer hover:text-prim1 "
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
         return getLiTag("topics", value, "rounded-full", indx);
      });
      let companies = filters?.companies?.map((value: string, indx: number) => {
         return getLiTag("companies", value, "rounded-full", indx);
      });
      let search =
         filters?.search &&
         getLiTag("search", filters?.search, "rounded-sm", filters?.search);
      let status =
         filters?.status &&
         getLiTag("status", filters?.status, "rounded-sm ", filters?.status);
      let list =
         filters?.list &&
         getLiTag("list", filters?.list, "rounded-sm", filters?.list);
      let difficulty =
         filters?.difficulty &&
         getLiTag(
            "difficulty",
            filters?.difficulty,
            `rounded-sm ${difficultyColor(filters?.difficulty)}`,
            filters?.difficulty
         );

      return [list, difficulty, status, search, topics, companies];
   }
   return <>{returnFilterdata(filterValues)}</>;
};

export default FilterIcons;
