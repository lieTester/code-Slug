// rect, next
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// component
import ProblemFilter from "@/components/subcomponent/Filter/ProblemFilters";
import Pagination from "@/components/subcomponent/Pagination";
import ProblemTableBase from "@/components/subcomponent/problemTable/ProblemTableBase";
import ProblemTableSkeleton from "@/components/subcomponent/problemTable/ProblemTableSkeleton";

const ProblemTable: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const setProblemSetLoading = problemContext?.setProblemSetLoading;
   const problemSetLoading = problemContext?.problemSetLoading;
   const filterdProblems = problemContext?.filterdProblems;
   const setPage = problemContext?.setPage;
   const page = problemContext?.page;

   useEffect(() => {
      if (
         filterdProblems &&
         filterdProblems?.length > 0 &&
         setProblemSetLoading
      ) {
         // console.log("main->", problemSetLoading, filterdProblems);
         setTimeout(() => {
            setProblemSetLoading({ loading: false });
            console.log("worked");
         }, 300); // Check if problems array is not empty
      }
   }, [filterdProblems]);

   const setPageSize = (size: number) => {
      if (setPage && filterdProblems) {
         setPage((prev: any) => {
            return {
               ...prev,
               pageSize: size,
               totalPages: Math.ceil(filterdProblems.length / size),
            };
         });
      }
   };
   return (
      <section className="relative md:w-[65%] lg:w-[70%] 2xl:w-[75%] font-baloo">
         <ProblemFilter />
         <div className="w-full overflow-x-auto overflow-y-hidden mt-4 pb-7">
            <table className="min-w-full ">
               <thead className="border-b-[0.5px] border-bordr1  text-prim1 ">
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
               {problemSetLoading?.loading ? (
                  <ProblemTableSkeleton />
               ) : (
                  <ProblemTableBase />
               )}
            </table>
         </div>
         <div className="relative py-3  flex justify-between items-center text-prim2 [&>*]:cursor-pointer ">
            <div
               className="relative bg-secod2 py-1 px-3 h-fit rounded-md group"
               tabIndex={0}
            >
               <span className="flex items-center ">
                  {page.pageSize} / page <IoMdArrowDropdown className="ml-2" />
               </span>
               <ul className="absolute mt-3 invisible opacity-0  group-focus:visible group-focus:opacity-100 transition-[transform] [&>li]:rounded-sm [&>li:hover]:bg-secod2 [&>*]:w-[120px] left-0 bg-front2 [&>*]:px-2 p-1 h-fit rounded-md ">
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
