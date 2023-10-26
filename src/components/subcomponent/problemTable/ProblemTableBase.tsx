import React, { useContext, useEffect } from "react";
// rect-icon
import { FaCheck } from "react-icons/fa";

// context
import { ProblemContext } from "@/context/ProblemsContext";

const ProblemTableBase: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const setAllProblems = problemContext?.setAllProblems;
   const problemSet = problemContext?.problemSet;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   const difficultyColor = (val: String) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   return (
      <tbody className="font-light transition-all ease-in-out">
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
                  <td className="py-2 px-4 text-center">{problem.platform}</td>
               </tr>
            ))}
      </tbody>
   );
};

export default ProblemTableBase;
