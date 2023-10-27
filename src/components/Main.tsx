// rect, next
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
// context
import { ProblemContext } from "@/context/ProblemsContext";
// component
import Filters from "@/components/subcomponent/Filters";
import Pagination from "@/components/subcomponent/Pagination";
import ProblemTableBase from "@/components/subcomponent/problemTable/ProblemTableBase";
import ProblemTableSkeleton from "@/components/subcomponent/problemTable/ProblemTableSkeleton";
// function
import { GetAllProblems } from "@/functions/ProblemFunctions";

const ProblemTable: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const allproblems = problemContext?.allproblems;
   const setAllProblems = problemContext?.setAllProblems;
   const setProblemSet = problemContext?.setProblemSet;
   const problemSet = problemContext?.problemSet;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   const [loading, setLoading] = useState(true);
   const searchParams = useSearchParams();
   useEffect(() => {
      if (setAllProblems && setPage) {
         console.log("setAllProblems:");
         GetAllProblems({ setAllProblems, setPage, page });
      }
   }, []);
   useEffect(() => {
      if (setPage) {
         const pagenumber = searchParams?.get("page") || "1";
         setPage((prev: any) => {
            return {
               ...prev,
               currPage: parseInt(pagenumber),
            };
         });
      }
   }, [searchParams?.get("page")]);

   useEffect(() => {
      if (allproblems && setProblemSet) {
         const problems: any[] = allproblems.slice(
            (page.currPage - 1) * page.pageSize,
            page.currPage * page.pageSize
         );
         if (problems) {
            // console.log(problems);
            setProblemSet(problems); // Update problemSet
            if (problemSet && problemSet?.length > 0) setLoading(false); // Check if problems array is not empty
         }
      }
   }, [page, allproblems]);

   return (
      <section className="relative w-full overflow-hidden lg:w-[70%] 2xl:w-[75%] font-baloo">
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
         <div className="flex justify-end text-prim2 [&>*]:cursor-pointer">
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
