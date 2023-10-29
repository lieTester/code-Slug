// rect, next
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// component
import Filters from "@/components/subcomponent/Filters";
import Pagination from "@/components/subcomponent/Pagination";
import ProblemTableBase from "@/components/subcomponent/problemTable/ProblemTableBase";
import ProblemTableSkeleton from "@/components/subcomponent/problemTable/ProblemTableSkeleton";

const ProblemTable: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   const currentPageProblemSet = problemContext?.currentPageProblemSet;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (currentPageProblemSet && currentPageProblemSet?.length > 0)
         setLoading(false); // Check if problems array is not empty
   }, [currentPageProblemSet]);

   const setPageSize = (size: number) => {
      if (setPage && currentListProblems) {
         setPage((prev: any) => {
            return {
               ...prev,
               pageSize: size,
               totalPages: currentListProblems.length / size,
            };
         });
      }
   };
   return (
      <section className="relative w-[100%]  lg:w-[70%] 2xl:w-[75%] font-baloo">
         <Filters />
         <div className="overflow-x-auto mt-4 mb-2">
            <table className="min-w-full ">
               <thead className="border-b-[0.5px] border-seco2  text-prim1 ">
                  <tr className="text-left [&>*]:font-medium">
                     <th className="py-2 px-4 text-center rounded-l-md">
                        Status
                     </th>
                     <th className="py-2 px-4">Title</th>
                     <th className="py-2 px-4 text-center">Difficulty</th>
                     <th className="py-2 px-4 text-center">Platforms</th>
                     <th className="py-2 px-4 text-center rounded-r-md">
                        Companies
                     </th>
                  </tr>
               </thead>
               {loading ? <ProblemTableSkeleton /> : <ProblemTableBase />}
            </table>
         </div>
         <div className="relative flex justify-between text-prim2 [&>*]:cursor-pointer ">
            <div
               className="relative bg-seco2  py-1 px-3 h-fit rounded-md group"
               tabIndex={0}
            >
               <span className="flex items-center ">
                  {page.pageSize} / page <IoMdArrowDropdown className="ml-2" />
               </span>
               <ul className="absolute invisible opacity-0 mt-3 group-focus:visible group-focus:opacity-100 transition-[transform] [&>li]:rounded-sm [&>li:hover]:bg-extra1 [&>*]:w-[120px] left-0 bg-seco2 [&>*]:px-2 p-1 h-fit rounded-md ">
                  <li
                     onClick={() => {
                        setPageSize(50);
                     }}
                  >
                     50 / page
                  </li>
                  <li
                     onClick={() => {
                        setPageSize(75);
                     }}
                  >
                     75 / page
                  </li>
                  <li
                     onClick={() => {
                        setPageSize(100);
                     }}
                  >
                     100 / page
                  </li>
               </ul>
            </div>
            {page && (
               <Pagination
                  currentPage={page.currPage}
                  totalPages={page.totalPages}
               />
            )}
         </div>
      </section>
   );
};

export default ProblemTable;
