import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";
import Pagination from "./Pagination";

const ProblemTable: React.FC = () => {
   const [allproblems, setAllProblems] = useState<any[]>([]);
   const [problemSet, setProblemSet] = useState<any[]>([]);
   const [page, setPage] = useState({
      currPage: 1,
      pageSize: 50,
      totalPages: 0,
   });

   useEffect(() => {
      const getProblems = async () => {
         await fetch("/api/problem/", {
            method: "GET",
         }).then((response: any) => {
            response.json().then((data: any) => {
               // console.log(data);
               setAllProblems(data.data);
               setPage((prev) => {
                  return {
                     ...prev,
                     totalPages: data.data.length / page.pageSize,
                  };
               });
            });
         });
      };
      getProblems();
   }, []);

   const router = useRouter();
   const searchParams = useSearchParams();
   useEffect(() => {
      if (
         setPage &&
         searchParams?.get("page") !== null &&
         searchParams?.get("page") !== undefined
      ) {
         const pagenumber = searchParams?.get("page") || "1";
         setPage((prev) => {
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
         // console.log(problems);
         if (problems) {
            setProblemSet(problems);
         }
      }
   }, [allproblems]);

   const difficultyColor = (val: String) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   return (
      <div className="overflow-x-auto my-4">
         <table className="min-w-full ">
            <thead className="border-b-[0.5px] border-seco2  text-prim1 ">
               <tr className="text-left [&>*]:font-medium">
                  <th className="py-2 px-4 text-center rounded-l-md">Status</th>

                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4 text-center">Difficulty</th>
                  <th className="py-2 px-4 text-center rounded-r-md">
                     Platform
                  </th>
               </tr>
            </thead>
            <tbody className="font-light">
               {problemSet &&
                  problemSet.map((problem: any, idx: number) => (
                     <tr
                        key={problem.id}
                        className={`${idx % 2 === 1 && "bg-prim2"} text-seco1`}
                     >
                        <td className="py-2 px-4 ">
                           {problem.status ? (
                              <FaCheck className="mx-auto text-green-500" />
                           ) : (
                              ""
                           )}
                        </td>
                        <td className="py-2 px-4  max-w-[300px] 2xl:w-auto truncate">
                           <a
                              href={`${problem.platformPath}${problem.titleSlug}`}
                              target="_blank"
                              className="hover:text-prim2"
                           >
                              {problem.frontEndId + ". " + problem.title}
                           </a>
                        </td>
                        <td
                           className={
                              "py-2 px-4 text-center !font-extralight " +
                              difficultyColor(problem.difficulty)
                           }
                        >
                           {problem.difficulty}
                        </td>
                        <td className="py-2 px-4 text-center">
                           {problem.platform}
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
         <div className="flex justify-end text-prim2 [&>*]:cursor-pointer">
            <Pagination
               currentPage={page.currPage}
               totalPages={page.totalPages}
            />
         </div>
      </div>
   );
};

export default ProblemTable;
