import React, { useContext, useEffect, useState } from "react";
// rect-icon
import { IoIosCodeWorking } from "react-icons/io";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";
import Image from "next/image";

// context
import { ProblemContext } from "@/context/ProblemsContext";
import { SessionContext } from "@/context/SessionContext";
// function
import { addUpdateProblemStatus } from "@/functions/ProblemFunctions";

const ProblemTableBase: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   const currentListProblems = problemContext?.currentListProblems;
   const currentPageProblemSet = problemContext?.currentPageProblemSet;
   const setCurrentPageProblemSet = problemContext?.setCurrentPageProblemSet;
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const difficultyColor = (val: String) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   const statusColor = (val: String) => {
      if (val === "solved") return "text-easy";
      else if (val === "attempted") return "text-medium";
      return "text-prim1";
   };

   const giveMyStatus = (status: string) => {
      if (status === "solved")
         return (
            <BsCheck2Circle
               className={`mr-1 text-[18px]  ${statusColor(status)}`}
            />
         );
      else if (status === "attempted")
         return (
            <IoIosCodeWorking
               className={`mr-1 text-[20px]  ${statusColor(status)}`}
            />
         );
      return <BsCalendarMinus className={`mr-1  ${statusColor(status)}`} />;
   };
   // this for user option visibility status //////////////////////////////////
   const [problemStatusVisiblity, setProblemStatusVisiblity] = useState<{
      [key: number]: boolean;
   }>({});
   const toggleStatusVisibility = (problemId: number, state?: boolean) => {
      const currstate =
         state !== undefined ? state : !problemStatusVisiblity[problemId];

      setProblemStatusVisiblity((prev) => ({
         ...prev,
         [problemId]: currstate,
      }));
   };

   const setStatus = async (id: number, status: string) => {
      // console.log(id);
      toggleStatusVisibility(id, false);

      if (session?.user) {
         addUpdateProblemStatus(id, session.user?.email, status).then((res) => {
            arrange(); // user logged in we want to show correct data as databse
         });
      } else {
         // user not logged in means potential user show them how feture work nothing gonna save in db
         arrange();
      }
      function arrange() {
         if (setCurrentListProblems && setCurrentPageProblemSet) {
            setCurrentListProblems((prev) => {
               return prev.map((item: any) =>
                  item.id === id ? { ...item, status: status } : item
               );
            });
            setCurrentPageProblemSet((prev) => {
               return prev.map((item: any) =>
                  item.id === id ? { ...item, status: status } : item
               );
            });
         }
      }
   };
   return (
      <tbody className="font-light transition-all ease-in-out ">
         {currentPageProblemSet &&
            currentPageProblemSet.map((problem: any, idx: number) => (
               <tr
                  key={problem.id}
                  className={`${
                     idx % 2 === 1 ? " bg-prim2 " : "bg-inherit"
                  } relative text-seco1 z-2`}
                  // over-flow visible is only meaningful to show overflow tag
               >
                  <td className="relative py-2 px-4 text-center  overflow-visible ">
                     <div
                        onFocus={() => toggleStatusVisibility(problem.id)}
                        onBlur={() => toggleStatusVisibility(problem.id, false)}
                        className=" cursor-pointer relative inline-block  "
                        tabIndex={0}
                     >
                        <button className="">
                           {problem.titleSlug && giveMyStatus(problem.status)}
                        </button>

                        <div
                           className={` ${
                              problemStatusVisiblity[problem.id]
                                 ? " opacity-100 visible"
                                 : " opacity-0 invisible"
                           }  absolute -top-0 -right-9 py-1 px-2 z-10 text-prim2 bg-prim2 rounded-sm transition-[opacity] drop-shadow-[0_0_0.5px_#ABB2BF] `}
                        >
                           <span className="absolute w-3 h-3 top-1 -left-[2px] rounded-sm bg-prim2 -z-[2] rotate-45 font-bold"></span>
                           <BsCheck2Circle
                              onClick={() => setStatus(problem.id, "solved")}
                              className=" text-[16px] mb-1 hover:text-easy"
                           />
                           <IoIosCodeWorking
                              onClick={() => setStatus(problem.id, "attempted")}
                              className=" text-[18px] mb-1 hover:text-medium"
                           />
                           <BsCalendarMinus
                              onClick={() => setStatus(problem.id, "todo")}
                              className="text-[16px] p-[1px]  mb-1 hover:text-prim1"
                           />
                        </div>
                     </div>
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
                        "py-2 px-4 text-center !font-extralight  " +
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
