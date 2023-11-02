import React, { useState, useRef, useContext, useEffect } from "react";
import { ProblemContext } from "@/context/ProblemsContext";
import { SessionContext } from "@/context/SessionContext";

const ProblemsProgress = () => {
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   useEffect(() => {
      if (setProblemsDetail) {
         let problemsDetail = initialState;
         currentListProblems?.map((problem) => {
            let dif = problem?.difficulty.toLowerCase();
            dif === "easy"
               ? (problemsDetail.totaleasy += 1)
               : dif === "medium"
               ? (problemsDetail.totalmedium += 1)
               : (problemsDetail.totalhard += 1);

            problem.status === "solved" &&
               (dif === "easy"
                  ? (problemsDetail.easy += 1)
                  : dif === "medium"
                  ? (problemsDetail.medium += 1)
                  : (problemsDetail.hard += 1));
         });
         problemsDetail.totalProblems = currentListProblems?.length || 0;
         problemsDetail.solvedProblems =
            problemsDetail.easy + problemsDetail.medium + problemsDetail.hard;
         setProblemsDetail(problemsDetail);
      }
   }, [currentListProblems]);

   const initialState = {
      easy: 0,
      medium: 0,
      hard: 0,
      totaleasy: 0,
      totalmedium: 0,
      totalhard: 0,
      solvedProblems: 0,
      totalProblems: 0,
   };
   const [problemsDetail, setProblemsDetail] = useState(initialState);
   const [svgData, setSvgData] = useState({
      radius: 42,
   });

   // Calculate the percentage of problems for each difficulty
   const easyPercentage =
      (problemsDetail.easy / problemsDetail.totalProblems) * 100;
   const mediumPercentage =
      (problemsDetail.medium / problemsDetail.totalProblems) * 100;
   const hardPercentage =
      (problemsDetail.hard / problemsDetail.totalProblems) * 100;

   // Calculate the lengths for dasharray
   const easyDashArray = (easyPercentage / 100) * 2 * Math.PI * svgData.radius;
   const mediumDashArray =
      (mediumPercentage / 100) * 2 * Math.PI * svgData.radius;
   const hardDashArray = (hardPercentage / 100) * 2 * Math.PI * svgData.radius;

   // Calculate the dashoffset values to make it continuous
   const easyDashOffset = 0;
   const mediumDashOffset = -(easyDashArray + 1); // Add 1 for a small gap
   const hardDashOffset = -(easyDashArray + mediumDashArray + 2); // Add 2 for a small gap

   // The gap between Easy and Medium can be adjusted by changing the added values (1 and 2).

   return (
      <div className="w-full h-fit bg-prim2 p-4 rounded-md shadow-md mb-4">
         <h2 className="text-lg mb-4 font-baloo font-semibold text-seco1">
            List Progress
         </h2>
         <div className=" flex justify-between items-center">
            <div className="w-[40%]  shrink-1 z-base relative max-h-[100px] max-w-[100px]">
               <svg
                  className="h-full w-full origin-center -rotate-90 transform"
                  viewBox="0 0 100 100"
               >
                  <circle
                     fill="none"
                     cx="50px"
                     cy="50px"
                     r={svgData.radius}
                     strokeWidth="3"
                     strokeLinecap="round"
                     stroke="currentColor"
                     className="text-seco1"
                  ></circle>
                  {problemsDetail.easy && (
                     <circle
                        fill="none"
                        cx="50px"
                        cy="50px"
                        r={svgData.radius}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        className="cursor-pointer text-easy"
                        strokeDasharray={`${easyDashArray} ${
                           2 * Math.PI * svgData.radius
                        }`}
                        strokeDashoffset={easyDashOffset}
                        data-difficulty="EASY"
                     ></circle>
                  )}
                  {problemsDetail.medium && (
                     <circle
                        fill="none"
                        cx="50px"
                        cy="50px"
                        r={svgData.radius}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        className="cursor-pointer text-medium"
                        strokeDasharray={`${mediumDashArray} ${
                           2 * Math.PI * svgData.radius
                        }`}
                        strokeDashoffset={mediumDashOffset}
                        data-difficulty="MEDIUM"
                     ></circle>
                  )}
                  {problemsDetail.hard && (
                     <circle
                        fill="none"
                        cx="50px"
                        cy="50px"
                        r={svgData.radius}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        className="cursor-pointer text-hard"
                        strokeDasharray={`${hardDashArray} ${
                           2 * Math.PI * svgData.radius
                        }`}
                        strokeDashoffset={hardDashOffset}
                        data-difficulty="HARD"
                     ></circle>
                  )}
               </svg>

               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-default">
                  <div className="truncate text-center ">
                     <div className="mb-[1px] text-[11px]">
                        <span className="text-label-3 dark:text-dark-label-3">
                           All
                        </span>
                     </div>
                     <div className=" pb-0.5 text-md font-medium leading-none lg:text-xl lg:leading-none">
                        {problemsDetail?.solvedProblems}
                     </div>
                     <hr className="mx-auto max-w-[32px]" />
                     <div className="pt-0.5 text-xs font-semibold">
                        {problemsDetail?.totalProblems}
                     </div>
                  </div>
               </div>
            </div>
            <ul className="min-w-[50%] h-full text-[16px] font-baloo [&>li]!my-auto ">
               <li className="text-seco1">
                  <span className="text-easy">Easy: </span>
                  {problemsDetail?.easy}/{problemsDetail?.totaleasy}
               </li>
               <li className="text-seco1">
                  <span className="text-medium ">Medium: </span>
                  {problemsDetail?.medium}/{problemsDetail?.totalmedium}
               </li>
               <li className="text-seco1">
                  <span className="text-hard ">Hard: </span>
                  {problemsDetail?.hard}/{problemsDetail?.totalhard}
               </li>
            </ul>
         </div>
      </div>
   );
};

export default ProblemsProgress;
