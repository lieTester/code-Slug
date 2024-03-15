import React, { useRef, useEffect, useState, useContext } from "react";
import { MdDelete } from "react-icons/md";
// types
import { ProblemsProp } from "@/types/index";
// components
import TruncateTags from "@/components/commonComponents/TruncateTag";
// functions
import {
   giveMyStatus,
   statusColor,
   difficultyColor,
   handleDrop,
} from "@/functions/Utils";
import {
   getSelectList,
   removeProblemFromList,
} from "@/functions/ListFunctions";
// context
import { ProblemContext } from "@/context/ProblemsContext";
import { SessionContext } from "@/context/SessionContext";
import { FiltersContext } from "@/context/FiltersContext";
import { applyFilter } from "@/functions/FilterFunctions";
import { DotLoader } from "@/components/commonComponents/Loaders";

const BaseListHolder: React.FC<{
   baseProblemList: ProblemsProp[];
   newProblemList: ProblemsProp[];
   setBaseProblemList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
   setNewProblemList: React.Dispatch<React.SetStateAction<ProblemsProp[]>>;
}> = ({
   baseProblemList,
   newProblemList,
   setBaseProblemList,
   setNewProblemList,
}) => {
   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;
   // problem Context
   const problemContext = useContext(ProblemContext);
   const currentListDetail = problemContext?.currentListDetail;
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const [selectedProblem, setSelectedProblem] = useState<{
      id?: number;
      name?: string;
      loader?: boolean;
   }>({});
   const [open, setOpen] = useState<boolean>(false);
   const onClose = () => {
      setOpen(false);
   };
   // filter Context
   const filtersContext = useContext(FiltersContext);

   const filterValues = filtersContext?.filterValues;

   const deleteProblemFromCurrentSelectedList = async () => {
      try {
         setSelectedProblem((prev) => {
            return { ...prev, loader: true };
         });
         currentListDetail?.id &&
            selectedProblem?.id &&
            removeProblemFromList(
               session?.user?.id,
               currentListDetail.id,
               selectedProblem.id
            ).then(async (res) => {
               if (
                  setCurrentListProblems &&
                  setFilterdProblems &&
                  currentListDetail?.id
               ) {
                  const { currentList } = await getSelectList(
                     currentListDetail.id,
                     session?.user?.id
                  );
                  setCurrentListProblems(currentList);
                  await applyFilter(filterValues, currentList).then(
                     ({ filteredProblemsList }) => {
                        setFilterdProblems &&
                           setFilterdProblems(filteredProblemsList);
                     }
                  );
               }
               setSelectedProblem({});
               onClose();
            });
      } catch (error) {
         console.log(error);
      }
   };
   ////////////////////////////////////////////////////////////////////////
   //////////////////////////////// main functions////////////////////////////////
   ////////////////////////////////////////////////////////////////////////

   const [displayedProblems, setDisplayedProblems] = useState(50);
   const lastElementRef = useRef<HTMLDivElement | null>(null);

   const loadMoreProblems = () => {
      if (baseProblemList && displayedProblems < baseProblemList.length) {
         setDisplayedProblems(displayedProblems + 5);
      }
   };

   const observeLastElement = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && displayedProblems < baseProblemList.length) {
         loadMoreProblems();
      }
   };

   useEffect(() => {
      const observer = new IntersectionObserver(observeLastElement, {
         root: null,
         rootMargin: "0px",
         threshold: 0.1,
      });

      if (lastElementRef.current) {
         observer.observe(lastElementRef.current);
      }

      return () => {
         observer.disconnect();
      };
   }, [lastElementRef, displayedProblems, baseProblemList]);

   const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      problem: ProblemsProp,
      index: number
   ) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(problem));
      // e.dataTransfer.effectAllowed = "none";
   };

   return (
      <>
         <div
            className="w-full pointer-events-auto h-[50%] overflow-y-auto  [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-front1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-backg2    "
            onDrop={(e) => {
               handleDrop(
                  e,
                  baseProblemList,
                  setBaseProblemList,
                  newProblemList,
                  setNewProblemList
               );
            }}
            onDragOver={(e) => {
               e.preventDefault();
            }}
         >
            {baseProblemList &&
               baseProblemList
                  .slice(0, displayedProblems)
                  .map((problem, index) => (
                     <div
                        key={problem.id}
                        ref={
                           index === displayedProblems - 1
                              ? lastElementRef
                              : null
                        }
                        draggable
                        onDragStart={(e) => handleDragStart(e, problem, index)}
                        className={`relative bg-backg2   w-[99%] mr-auto mb-2 rounded-md px-3 py-2 text-prim2   cursor-grab border-bordr1 border-[1px] truncate`}
                     >
                        <ul className="flex justify-between">
                           <h1
                              title={problem.title}
                              className="truncate text-prim1  font-medium"
                           >
                              {problem.title}
                           </h1>
                           <li className="flex items-center">
                              <span
                                 className={`${difficultyColor(
                                    problem.difficulty
                                 )} mx-2`}
                              >
                                 {problem.difficulty}
                              </span>
                              <span
                                 className={`${statusColor(
                                    problem.status || ""
                                 )} `}
                              >
                                 {problem?.status &&
                                    giveMyStatus(problem?.status)}
                              </span>
                           </li>
                        </ul>
                        <ul className="mt-1 flex cursor-default">
                           {problem?.topics && (
                              <TruncateTags
                                 tags={problem.topics}
                                 maxWidth={350}
                                 ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                                 liCss="relative rounded-full bg-secod1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
                              />
                           )}
                           {currentListDetail?.isPublic === false && (
                              <button
                                 onClick={() => {
                                    setSelectedProblem(() => {
                                       return {
                                          id: problem?.id,
                                          name: problem?.title,
                                       };
                                    });
                                    setOpen(true);
                                 }}
                                 className="text-base text-hard cursor-pointer"
                              >
                                 <MdDelete />
                              </button>
                           )}
                        </ul>
                     </div>
                  ))}
         </div>
         <div
            className={`${
               open ? "fixed" : "hidden"
            }   top-0 left-0 inset-0 flex items-center justify-center z-[100]  fade`}
         >
            <div
               onClick={onClose}
               className="absolute w-full h-full  bg-clip-padding backdrop-filter backdrop-blur-lg "
            ></div>
            <div
               className={` min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-xl font-sofiaPro font-semibold mx-auto bg-black bg-opacity-25 backdrop-brightness-[.7] backdrop-blur-md`}
            >
               <div className="w-fit mx-auto">
                  Are You Sure You want to{" "}
                  <span className="text-hard">Unlink </span>
                  {selectedProblem?.name} ?
               </div>
               <div className="mt-4 flex justify-around [&>*]:px-2 [&>*]:py-1 [&>*]:rounded-md">
                  <button
                     onClick={onClose}
                     className="w-24 text-hard border-[2px] border-secod1"
                  >
                     Cancel
                  </button>

                  <button
                     onClick={() => {
                        !selectedProblem?.loader &&
                           deleteProblemFromCurrentSelectedList();
                     }}
                     className="w-24 text-easy border-[2px] border-secod1"
                  >
                     {selectedProblem?.loader ? <DotLoader /> : "Ok"}
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default BaseListHolder;
