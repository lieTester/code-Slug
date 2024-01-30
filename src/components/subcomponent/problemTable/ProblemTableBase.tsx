import React, { useContext, useEffect, useState } from "react";
// rect-icon
import { IoIosCodeWorking } from "react-icons/io";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";
import { TbLayoutBottombarExpandFilled } from "react-icons/tb";
import Image from "next/image";

// context
import { ProblemContext } from "@/context/ProblemsContext";
import { SessionContext } from "@/context/SessionContext";
// function
import { addUpdateProblemStatus } from "@/functions/ProblemFunctions";
import { ProblemsProp } from "@/types";
import TruncateTags from "@/components/subcomponent/problemTable/TruncateTag";
import SingleProblem from "@/components/subcomponent/problemTable//SingleProblem";

const ProblemTableBase: React.FC = () => {
   const problemContext = useContext(ProblemContext);
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   const currentPageProblemSet = problemContext?.currentPageProblemSet;
   const setFilterdProblems = problemContext?.setFilterdProblems;
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
            arrangeStatus(); // user logged in we want to show correct data as databse
         });
      } else {
         // user not logged in means potential user show them how feture work nothing gonna save in db
         arrangeStatus();
      }
      function arrangeStatus() {
         if (setCurrentListProblems && setFilterdProblems) {
            setCurrentListProblems((prev) => {
               return prev.map((item: any) =>
                  item.id === id ? { ...item, status: status } : item
               );
            });
            setFilterdProblems((prev) => {
               return prev.map((item: any) =>
                  item.id === id ? { ...item, status: status } : item
               );
            });
         }
      }
   };

   ///////////////////////////////////////////////////////////////////////////////////////
   // single page Problem handler
   const [currentProblem, setCurrentPageProblem] = useState<ProblemsProp>();
   const [singleProblemVisblity, setSingleProblemVisblity] =
      useState<boolean>(false);

   return (
      <>
         <tbody className="font-light transition-all ease-in-out ">
            <SingleProblem
               problem={currentProblem}
               open={singleProblemVisblity}
               onClose={setSingleProblemVisblity}
            />
            {currentPageProblemSet &&
               currentPageProblemSet.map(
                  (problem: ProblemsProp, idx: number) => (
                     <tr
                        key={problem.id}
                        className={`${
                           idx % 2 === 1 ? " bg-backg2 " : "bg-inherit"
                        } relative text-seco1 z-2`}
                        // over-flow visible is only meaningful to show overflow tag
                     >
                        <td className="relative py-2 px-4 text-center  overflow-visible ">
                           <div
                              onFocus={() => toggleStatusVisibility(problem.id)}
                              onBlur={() =>
                                 toggleStatusVisibility(problem.id, false)
                              }
                              className=" cursor-pointer relative inline-block  "
                              tabIndex={0}
                           >
                              <button className="">
                                 {problem.titleSlug &&
                                    giveMyStatus(problem?.status || "todo")}
                              </button>

                              <div
                                 className={` ${
                                    problemStatusVisiblity[problem.id]
                                       ? " opacity-100 visible"
                                       : " opacity-0 invisible"
                                 }  absolute -top-0 -right-9 py-1 px-2 z-10 text-prim2 bg-backg2 rounded-sm transition-[opacity] drop-shadow-[0_0_0.5px_#ABB2BF] `}
                              >
                                 <span className="absolute w-3 h-3 top-1 -left-[2px] rounded-sm bg-backg2 -z-[2] rotate-45 font-bold"></span>
                                 <BsCheck2Circle
                                    onClick={() =>
                                       setStatus(problem.id, "solved")
                                    }
                                    className=" text-[16px] mb-1 hover:text-easy"
                                 />
                                 <IoIosCodeWorking
                                    onClick={() =>
                                       setStatus(problem.id, "attempted")
                                    }
                                    className=" text-[18px] mb-1 hover:text-medium"
                                 />
                                 <BsCalendarMinus
                                    onClick={() =>
                                       setStatus(problem.id, "todo")
                                    }
                                    className="text-[16px] p-[1px]  mb-1 hover:text-prim1"
                                 />
                              </div>
                           </div>
                        </td>
                        <td className="relative hover:text-prim1 cursor-pointer py-2 px-4 max-w-[300px] 2xl:w-auto !truncate [&:hover>ul]:visible [&:hover>ul]:opacity-100 [&:hover>ul]:h-fit transition-all ease-linear">
                           <span
                              title={problem.frontEndId + ". " + problem.title}
                           >
                              {problem.frontEndId + ". " + problem.title}
                           </span>
                           {problem?.tags && (
                              <TruncateTags
                                 tags={problem.tags}
                                 maxWidth={320}
                                 ulCss="relative h-0 invisible opacity-0  w-full flex rounded-sm  transition-all ease-linear z-[5] "
                                 liCss="relative rounded-full bg-secod1 text-xs  mx-[2px] px-1"
                              />
                           )}
                        </td>

                        <td
                           className={
                              "py-2 px-4 text-center !font-extralight  " +
                              difficultyColor(problem.difficulty)
                           }
                        >
                           {problem.difficulty}
                        </td>
                        <td className="py-2 px-1 text-center [&::-webkit-scrollbar]:h-[2px] overflow-x-auto">
                           <div className="w-full h-full flex items-center justify-center">
                              {problem?.PlatformLinks &&
                                 problem.PlatformLinks.map(
                                    ({
                                       name,
                                       link,
                                    }: {
                                       name: string;
                                       link: string;
                                    }) => {
                                       return (
                                          <a
                                             key={link}
                                             href={link}
                                             target="_blank"
                                          >
                                             <Image
                                                src={`/platforms/${name}.png`}
                                                width={"25"}
                                                height={"25"}
                                                alt={`platform-link=${name}`}
                                             />
                                          </a>
                                       );
                                    }
                                 )}
                           </div>
                        </td>
                        <td className="relative py-2 px-1 text-center max-w-[210px]  [&::-webkit-scrollbar]:h-[2px] overflow-x-auto [&:hover>div]:opacity-100 ">
                           <div
                              className="absolute opacity-0 inset-0 w-full h-full z-10 flex items-center justify-center text-prim1 bg-clip-padding backdrop-filter backdrop-blur-sm transition-opacity ease-in-out cursor-pointer"
                              onClick={() => {
                                 setCurrentPageProblem(problem);
                                 setSingleProblemVisblity(true);
                              }}
                           >
                              <TbLayoutBottombarExpandFilled className="w-7" />{" "}
                              Expand View
                           </div>
                           {problem?.companies && (
                              <TruncateTags
                                 tags={problem.companies}
                                 maxWidth={200}
                                 ulCss="w-full  flex justify-start text-prim1"
                                 liCss="whitespace-nowrap text-center rounded-full  bg-secod1  text-xs mr-[4px] px-1 "
                              />
                           )}
                        </td>
                     </tr>
                  )
               )}
         </tbody>
      </>
   );
};

export default ProblemTableBase;
