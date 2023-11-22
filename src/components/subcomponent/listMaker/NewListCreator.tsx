import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
//icons
import { CiCircleCheck } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";
// type
import { ProblemsProp } from "@/types/index";
import TruncateTags from "../problemTable/TruncateTag";
// functions
import {
   giveMyStatus,
   statusColor,
   difficultyColor,
   handleDrop,
} from "@/functions/Utils";
import { createNewList, getAllLists } from "@/functions/ListFunctions";
// context
import { SessionContext } from "@/context/SessionContext";
//component
import { DotLoader } from "@/components/subcomponent/Loaders";

const NewListCreator: React.FC<{
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
   ////////////////////////////////////////////////////////////////////////
   //////////////////////////////// main functions////////////////////////////////
   ////////////////////////////////////////////////////////////////////////
   const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      problem: ProblemsProp
   ) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(problem));
   };

   const [listName, setListName] = useState("");
   const [userLists, setUserLists] = useState<any>([]);
   const [listNameExist, setListNameExist] = useState(true);
   const [listCreationProgress, setListCreationProgress] = useState(false);
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;
   const router = useRouter();

   useEffect(() => {
      const collectUserLists = async () => {
         await getAllLists(session?.user?.id).then((res) => {
            setUserLists(res.data.lists);
            console.log(res.data.lists);
         });
      };
      try {
         if (session?.user) collectUserLists();
      } catch (error) {
         console.log(error);
      }
   }, []);

   const checkListNameAlreadyExists = async (name: string) => {
      setListName(name);
      const isExist = userLists.some(
         (list: any) => list.slug === name.toLowerCase().replace(/ /g, "-")
      );
      setListNameExist(isExist);
   };
   const checkBeforeCreateNewList = async () => {
      console.log(
         "working list already exists",
         listNameExist,
         listName.length
      );
      if (listName.length > 0 && !listNameExist) {
         setListCreationProgress(true);
         setListName("");
         await createNewList({
            id: session?.user?.id,
            listName,
            currentList: newProblemList,
         })
            .then((res: any) => {
               if (res.status === 200) {
                  router.push("/");
               }
            })
            .catch((err) => {
               console.log(err);
               setListCreationProgress(false);
            });
      }
   };
   return (
      <div
         className="relative w-2/3 bg-black/10 h-full   ml-2  border-seco2 border-[1px] rounded-md overflow-hidden"
         onDrop={(e) => {
            handleDrop(
               e,
               newProblemList,
               setNewProblemList,
               baseProblemList,
               setBaseProblemList
            );
         }}
         onDragOver={(e) => {
            e.preventDefault();
         }}
      >
         <div className=" p-2  h-full overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-seco1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-prim2 ">
            <div className="grid grid-cols-3 gap-2 col-span-3 mb-10">
               {newProblemList &&
                  newProblemList.map((problem, index) => (
                     <div
                        key={problem.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, problem)}
                        className={`${
                           index % 2 === 1
                              ? " bg-prim2  "
                              : " bg-black bg-opacity-10 bg-blur-lg "
                        }  w-full h-fit block  rounded-md px-3 py-2 text-prim2   cursor-pointer border-seco2 border-[1px] truncate`}
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
                        <ul className="mt-1">
                           {problem?.tags && (
                              <TruncateTags
                                 tags={problem.tags}
                                 maxWidth={200}
                                 ulCss="relative w-full flex rounded-sm  transition-all ease-linear z-[5] "
                                 liCss="relative rounded-full bg-seco1 text-xs  mr-[4px] px-1 whitespace-nowrap hover:text-prim1"
                              />
                           )}
                        </ul>
                     </div>
                  ))}
            </div>
         </div>
         {newProblemList.length && (
            <div className="w-full absolute  left-0 bottom-[0px] bg-seco1 flex border-[1px] border-seco2 z-[20]">
               <span className="relative p-1 w-full">
                  <input
                     type="text"
                     value={listName}
                     onChange={(e) =>
                        checkListNameAlreadyExists(e.target.value)
                     }
                     placeholder="Enter the list name..."
                     className="w-full bg-transparent outline-none"
                  />
               </span>
               {listCreationProgress ? (
                  <div className="w-[20%]  bg-prim2  flex items-center justify-center pt-2">
                     <DotLoader />
                  </div>
               ) : (
                  <button
                     className="w-[20%]  bg-prim2 hover:bg-prim1 text-prim2 px-3 flex items-center justify-between"
                     onClick={checkBeforeCreateNewList}
                  >
                     Create
                     <span className="right-0">
                        {listNameExist ? (
                           <AiOutlineCloseCircle className="text-hard" />
                        ) : (
                           <CiCircleCheck className="text-easy" />
                        )}
                     </span>
                  </button>
               )}
            </div>
         )}
      </div>
   );
};

export default NewListCreator;
