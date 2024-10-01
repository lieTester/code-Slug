import React, { useEffect, useState } from "react";
import { ProblemAndTopicsOfTheDay } from "@/types";
import TruncateTags from "@/components/commonComponents/TruncateTag";
import { giveMyStatus, statusColor } from "@/functions/Utils";
const CalProblemsOfDay: React.FC<ProblemAndTopicsOfTheDay> = ({
   dayProblems,
   setDayProblems,
}) => {
   const [currProblem, setCurrentProblem] = useState<{
      problemId?: number;
      problemTitle?: string;
      status?: string;
      updatedAt?: Date;
      topics?: { id: number; name: string }[];
   }>();
   const daysOfWeek: string[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
   ];

   useEffect(() => {
      dayProblems?.problems && setCurrentProblem(dayProblems?.problems[0]);
   }, [dayProblems?.problems]);
   return (
      <div
         className={`${
            dayProblems?.open ? "fixed" : "hidden"
         }   top-0 left-0 inset-0 flex items-center justify-center z-[100]   `}
      >
         <div
            onClick={() => {
               setDayProblems({ open: false });

               setCurrentProblem({});
            }}
            className="absolute w-full h-full backdrop-blur-md backdrop-filter  "
         ></div>
         <span
            onClick={() => {
               setDayProblems({ open: false });
               setCurrentProblem({});
            }}
            className="absolute top-[2vh] right-4 text-hard text-2xl font-sofiaPro font-extrabold"
         >
            X
         </span>
         <div className="relative w-full h-full mt-20 md:mt-0 md:w-[80%] lg:w-[70%] md:h-[60%]  bg-backg2 p-4 lg:rounded-lg flex justify-between  z-10   [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg2 ">
            {dayProblems?.problems?.length === 0 ? (
               <div className="w-full  h-full flex justify-center items-center text-xl">
                  <span className="text-hard font-bold mx-1">No Data</span> for{" "}
                  <span className="text-medium font-bold mx-1">
                     {dayProblems?.date &&
                        daysOfWeek[dayProblems?.date?.getDay() - 1]}
                  </span>
                  <span className="text-easy font-bold mx-2">Date </span>
                  {"  "}
                  {dayProblems?.date?.getDate()}
                  {" : "}
                  {dayProblems?.date && dayProblems?.date?.getMonth() + 1}
                  {" : "}
                  {dayProblems?.date?.getFullYear()}
               </div>
            ) : (
               <>
                  <div className=" w-[60%] max-w-4xl flex flex-col px-4">
                     {currProblem?.problemId && (
                        <>
                           <h1
                              title={
                                 currProblem?.problemId +
                                 ". " +
                                 currProblem?.problemTitle
                              }
                              className="text-2xl font-semibold mb-2 text-prim2 font-sofiaPro"
                           >
                              {currProblem?.problemId +
                                 ". " +
                                 currProblem?.problemTitle}
                           </h1>
                           <ul className="flex mb-2 [&>*]:mr-4">
                              <li
                                 className={
                                    currProblem?.status &&
                                    statusColor({
                                       val: currProblem?.status,
                                    }) + " flex items-center"
                                 }
                              >
                                 {currProblem?.status &&
                                    giveMyStatus({
                                       status: currProblem?.status,
                                    })}
                                 {currProblem?.status &&
                                    giveMyStatus({
                                       status: currProblem?.status,
                                    }) &&
                                    currProblem?.status
                                       ?.charAt(0)
                                       .toUpperCase() +
                                       currProblem?.status?.slice(1)}
                              </li>
                           </ul>
                           <div className="flex-grow  text-prim1 px-1 overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-front1">
                              <div className="  rounded-md mb-2  bg-clip-padding backdrop-filter backdrop-blur-lg">
                                 <h2 className="text-seco1 text-md font-semibold my-1">
                                    Topics :
                                 </h2>

                                 <ul className="w-full flex flex-wrap justify-start text-prim1 mb-2">
                                    {currProblem?.topics?.map((topic) => {
                                       return (
                                          <li
                                             key={topic.id}
                                             className="whitespace-nowrap text-center rounded-full
                     bg-secod1 text-xs m-[4px] px-2 "
                                          >
                                             {topic.name}
                                          </li>
                                       );
                                    })}
                                 </ul>
                              </div>
                           </div>
                        </>
                     )}
                  </div>
                  <div className="w-[40%] overflow-y-auto">
                     {dayProblems?.problems?.map((problem) => {
                        return (
                           <div
                              key={problem.problemId}
                              onClick={() => {
                                 setCurrentProblem(problem);
                              }}
                              className={` bg-black bg-opacity-50 bg-blur-lg w-full h-fit block  rounded-md px-3 py-2 mb-1 text-prim2   cursor-pointer border-bordr1 border-[1px] truncate`}
                           >
                              <ul className="flex justify-between">
                                 <h1
                                    title={problem.problemTitle}
                                    className="truncate text-prim1 font-medium"
                                 >
                                    {problem.problemTitle}
                                 </h1>
                                 <li className="flex items-center">
                                    <span
                                       className={`${statusColor({
                                          val: problem.status || "",
                                       })} `}
                                    >
                                       {problem?.status &&
                                          giveMyStatus({
                                             status: problem?.status,
                                          })}
                                    </span>
                                 </li>
                              </ul>
                              <ul className="mt-1">
                                 {problem?.topics && (
                                    <TruncateTags
                                       tags={problem.topics.map(
                                          (topic) => topic.name
                                       )}
                                       maxWidth={200}
                                       ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                                       liCss="relative rounded-full bg-secod1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
                                    />
                                 )}
                              </ul>
                           </div>
                        );
                     })}
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default CalProblemsOfDay;
