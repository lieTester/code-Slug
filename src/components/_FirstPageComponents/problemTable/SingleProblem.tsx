import React from "react";
import { ProblemsProp } from "@/types";
import { IoIosCodeWorking } from "react-icons/io";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";

const SingleProblem = ({
   open,
   onClose,
   problem,
}: {
   open: boolean;
   onClose: (value: boolean) => void;
   problem: ProblemsProp | undefined;
}) => {
   const difficultyColor = (val: String | undefined) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   const statusColor = (val: String | undefined) => {
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
      return (
         <BsCalendarMinus
            className={`mr-1 text-[15px] ${statusColor(status)}`}
         />
      );
   };
   return (
      <tr
         className={` ${
            open ? "fixed" : "hidden"
         } flex justify-center items-center w-full h-full pt-[15%] lg:pt-20 lg:p-10  z-20 top-0 left-0 transition-opacity ease-in-out`}
      >
         <td
            onClick={() => onClose(false)}
            className="absolute w-full h-full  bg-clip-padding backdrop-filter backdrop-blur-lg "
         ></td>

         <td className="relative w-[100%] h-full  bg-backg2 p-6 lg:rounded-lg flex justify-between  z-10">
            <div
               onClick={() => onClose(false)}
               className="absolute right-2 cursor-pointer top-0 lg:hidden text-white font-extrabold"
            >
               X
            </div>
            <div className="shadow-md w-[40%] max-w-4xl flex flex-col">
               <h1
                  title={problem?.id + ". " + problem?.title}
                  className="text-2xl font-semibold mb-2 text-prim2 font-sofiaPro"
               >
                  {problem?.id + ". " + problem?.title}
               </h1>
               <ul className="flex mb-2 [&>*]:mr-4">
                  <li className={difficultyColor(problem?.difficulty)}>
                     {problem?.difficulty}
                  </li>
                  <li
                     className={
                        statusColor(problem?.status) + " flex items-center"
                     }
                  >
                     {problem?.status && giveMyStatus(problem?.status)}
                     {problem?.status &&
                        giveMyStatus(problem?.status) &&
                        problem?.status?.charAt(0).toUpperCase() +
                           problem?.status?.slice(1)}
                  </li>
               </ul>
               <div className="flex-grow  text-prim1 px-1 overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-front1">
                  {problem?.description}
                  <div className="  rounded-md mb-2  bg-clip-padding backdrop-filter backdrop-blur-lg">
                     <h2 className="text-seco1 text-md font-semibold my-1">
                        Topics :
                     </h2>

                     <ul className="w-full flex flex-wrap justify-start text-prim1 mb-2">
                        {problem?.topics?.map(
                           (value: string, index: number) => {
                              return (
                                 <li
                                    key={index}
                                    className="whitespace-nowrap text-center rounded-full
                     bg-secod1 text-xs m-[4px] px-2 "
                                 >
                                    {value}
                                 </li>
                              );
                           }
                        )}
                     </ul>
                     <h2 className="text-seco1 text-md font-semibold my-1">
                        Companies :
                     </h2>

                     <ul className="w-full flex flex-wrap justify-start text-prim1 mb-2">
                        {problem?.companies?.map(
                           (value: string, index: number) => {
                              return (
                                 <li
                                    key={index}
                                    className="whitespace-nowrap text-center rounded-full
                     bg-secod1 text-xs m-[4px] px-2 "
                                 >
                                    {value}
                                 </li>
                              );
                           }
                        )}
                     </ul>
                  </div>
                  <pre className="text-seco2 bg-secod1 p-2 rounded-md mb-2">
                     <h2 className="text-md font-semibold mb-2">
                        Sample Input
                     </h2>
                     <pre>
                        <code>{`[2, 7, 11, 15], target = 9`}</code>
                     </pre>
                  </pre>
                  <pre className="text-seco2 bg-secod1 p-2 rounded-md">
                     <h2 className="text-md font-semibold mb-2">Output</h2>
                     <pre>
                        <code>{`[0, 1]`}</code>
                     </pre>
                  </pre>
               </div>
            </div>
            <div className="w-[55%] bg-secod1 rounded-md p-2">
               <h1
                  title={problem?.id + ". " + problem?.title}
                  className="text-xl font-semibold mb-2 text-seco2 font-sofiaPro"
               >
                  Notes :
               </h1>
               <div className=""> write notes here.....</div>
            </div>
         </td>
      </tr>
   );
};

export default SingleProblem;
