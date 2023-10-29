import React, { useContext, useEffect } from "react";
// rect-icon
import { FaCheck } from "react-icons/fa";
import Image from "next/image";

// context
import { ProblemContext } from "@/context/ProblemsContext";

const ProblemTableBase: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const currentPageProblemSet = problemContext?.currentPageProblemSet;

   const difficultyColor = (val: String) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   return (
      <tbody className="font-light transition-all ease-in-out">
         {currentPageProblemSet &&
            currentPageProblemSet.map((problem: any, idx: number) => (
               <tr
                  key={problem.id}
                  className={`${
                     idx % 2 === 1 && "bg-prim2"
                  } relative text-seco1 z-[2] [&>*]:overflow-visible`}
                  // over-flow visible is only meaningful to show overflow tag
               >
                  <td className="py-2 px-4 ">
                     {problem.status ? (
                        <FaCheck className="mx-auto text-green-500" />
                     ) : (
                        ""
                     )}
                  </td>
                  <td className="relative hover:text-prim1 cursor-pointer py-2 px-4 max-w-[300px] 2xl:w-auto !truncate [&:hover>ul]:visible [&:hover>ul]:opacity-100 [&:hover>ul]:h-fit transition-all ease-linear">
                     {problem.frontEndId + ". " + problem.title}
                     <ul className="relative h-0 invisible opacity-0  w-full rounded-sm  transition-all ease-linear z-[5] !truncate">
                        {problem.tags.map((name: string, indx: number) => {
                           return (
                              <li
                                 key={indx}
                                 className="relative rounded-full bg-seco1 text-xs inline mx-[2px] px-1"
                              >
                                 {name}
                              </li>
                           );
                        })}
                     </ul>
                  </td>

                  <td
                     className={
                        "py-2 px-4 text-center !font-extralight " +
                        difficultyColor(problem.difficulty)
                     }
                  >
                     {problem.difficulty}
                  </td>
                  <td className="py-2 px-4 text-center truncate flex justify-center items-center">
                     {problem.PlatformLinks.map(
                        ({ name, link }: { name: string; link: string }) => {
                           return (
                              <span key={link} className=" inline">
                                 <a href={link} target="_blank">
                                    <Image
                                       src={`/platforms/${name}.png`}
                                       width={"25"}
                                       height={"25"}
                                       alt={`platform-link=${name}`}
                                    />
                                 </a>
                              </span>
                           );
                        }
                     )}
                  </td>
                  <td className="py-2 px-4 text-center">{}</td>
               </tr>
            ))}
      </tbody>
   );
};

export default ProblemTableBase;
