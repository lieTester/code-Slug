import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { LiaClipboardListSolid } from "react-icons/lia";
import { IoIosCodeWorking } from "react-icons/io";
import { IoChevronBackSharp } from "react-icons/io5";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";
// types
import { listProp, ProblemsProp } from "@/types";
// contexts
import { SessionContext } from "@/context/SessionContext";
// functions
import { updateUserProblemLikeDislike } from "@/functions/ProblemFunctions";
import {
   addProblemToList,
   createNewList,
   fetchUserListsWithProblemStatus,
   removeProblemFromList,
} from "@/functions/ListFunctions";

const SingleProblem = ({
   open,
   onClose,
   problem,
}: {
   open: boolean;
   onClose: (value: boolean) => void;
   problem: ProblemsProp | undefined;
}) => {
   // session context
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
   const problemId = useMemo(() => problem?.id, [problem?.id]);

   const listsDropDown = useRef<HTMLDivElement>(null);
   const [newListName, setNewListName] = useState<string>("");
   const [lists, setLists] = useState<listProp[]>([]);
   const [selectedList, setSelectedList] = useState<{ [key: string]: boolean }>(
      {}
   );

   const [listsView, setListsView] = useState<{
      block: boolean;
      lists: boolean;
   }>({ block: false, lists: true });

   const [reactions, setReactions] = useState<{
      isLiked: boolean | undefined | null;
      totalDislikes: number;
      totalLikes: number;
   }>();
   ////////////////////////////////////////////////////////////////
   /// functions
   const difficultyColor = ({ val }: { val: String | undefined }) => {
      if (val === "Easy") return "text-easy";
      else if (val === "Medium") return "text-medium";
      return "text-hard";
   };
   const statusColor = ({ val }: { val: String | undefined }) => {
      if (val === "solved") return "text-easy";
      else if (val === "attempted") return "text-medium";
      return "text-prim1";
   };
   const giveMyStatus = ({ status }: { status: string }) => {
      if (status === "solved")
         return (
            <BsCheck2Circle
               className={`mr-1 text-[18px]  ${statusColor({ val: status })}`}
            />
         );
      else if (status === "attempted")
         return (
            <IoIosCodeWorking
               className={`mr-1 text-[20px]  ${statusColor({ val: status })}`}
            />
         );
      return (
         <BsCalendarMinus
            className={`mr-1 text-[15px] ${statusColor({ val: status })}`}
         />
      );
   };

   const updateUserLikeness = async ({
      problemID,
      isLiked,
   }: {
      problemID: number;
      isLiked: boolean;
   }) => {
      try {
         // show data before updating for effect
         const totalDislikes = isLiked
            ? Math.max(0, (reactions?.totalDislikes || 0) - 1)
            : Math.max(0, (reactions?.totalDislikes || 0) + 1);
         const totalLikes = isLiked
            ? Math.max(0, (reactions?.totalLikes || 0) + 1)
            : Math.max(0, (reactions?.totalLikes || 0) - 1);
         setReactions({ isLiked, totalDislikes, totalLikes });

         // update and get accurate data
         session?.user?.id &&
            updateUserProblemLikeDislike({
               problemID,
               isLiked,
               userId: session?.user?.id,
            })
               .then((res) => {
                  setReactions(res.data);
               })
               .catch((err) => {
                  throw err;
               });
      } catch (error) {
         console.error(error);
      }
   };

   const fetchLists = async () => {
      try {
         problemId &&
            (await fetchUserListsWithProblemStatus({
               userId,
               problemId: problemId,
            })
               .then((res) => {
                  setSelectedList(
                     res.formattedLists.reduce(
                        (acc: { [key: string]: boolean }, list: listProp) => {
                           acc[`${list.id}`] =
                              list.isLinkedWithProblem || false;
                           return acc;
                        },
                        {}
                     )
                  );
                  setLists(res?.formattedLists);
               })
               .catch((err) => {
                  throw err;
               }));
      } catch (error) {
         console.error(error);
      }
   };

   const handelListDropDown = (event: React.FocusEvent) => {
      if (
         listsDropDown.current &&
         !listsDropDown.current.contains(event.relatedTarget)
      ) {
         setListsView({ block: false, lists: true });
      }
   };

   const handelListsCalls = async ({ key }: { key: string }) => {
      try {
         switch (key) {
            case "openCreateNewListBlock":
               if (listsView.lists) {
                  setListsView((prev) => {
                     return { ...prev, lists: false };
                  });
               } else {
                  if (userId && newListName.length >= 4 && problem) {
                     setListsView({
                        block: false,
                        lists: true,
                     });
                     await createNewList({
                        userId,
                        listName: newListName,
                        currentList: [problem],
                     })
                        .then(() => {
                           fetchLists();
                        })
                        .catch((err) => {
                           throw err;
                        });
                     setNewListName("");
                  }
               }
               break;
            case "openAllListsView":
               setListsView((prev) => {
                  return { ...prev, lists: true };
               });
               break;
            case "toggleListBlock":
               setListsView({
                  block: !listsView.block,
                  lists: true,
               });
               break;

            default:
               break;
         }
      } catch (error) {
         console.error(error);
      }
   };

   const handelListSelectionForProblem = async ({
      listId,
   }: {
      listId: string;
   }) => {
      try {
         setSelectedList((prev) => {
            return {
               ...prev,
               [`${listId}`]: !selectedList[`${listId}`],
            };
         });
         handelListsCalls({ key: "toggleListBlock" });
         if (userId && problemId && listId) {
            if (selectedList[`${listId}`]) {
               //means user want to toggle from selection to deselect
               await removeProblemFromList({ userId, listId, problemId }).then(
                  () => {
                     fetchLists();
                  }
               );
            } else {
               //means user want to toggle from deselect to selection
               await addProblemToList({ userId, listId, problemId }).then(
                  () => {
                     fetchLists();
                  }
               );
            }
         }
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      userId && fetchLists();
   }, [userId, problemId]);

   useEffect(() => {
      problem &&
         setReactions({
            isLiked: problem?.isLiked,
            totalDislikes: problem?.dislike,
            totalLikes: problem?.like,
         });
   }, [problemId]);
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

         <td className="relative w-[100%] h-full  bg-backg2 p-4 lg:rounded-lg flex justify-between  z-10">
            <div
               onClick={() => onClose(false)}
               className="absolute right-2 cursor-pointer top-0 lg:hidden text-white font-extrabold"
            >
               X
            </div>
            <div className="relative w-[40%] max-w-4xl flex flex-col">
               <h1
                  title={problem?.id + ". " + problem?.title}
                  className="text-2xl font-semibold mb-2 text-prim2 font-sofiaPro"
               >
                  {problem?.id + ". " + problem?.title}
               </h1>
               <ul className="flex mb-2 [&>*]:mr-4">
                  <li className={difficultyColor({ val: problem?.difficulty })}>
                     {problem?.difficulty}
                  </li>
                  <li
                     className={
                        statusColor({ val: problem?.status }) +
                        " flex items-center"
                     }
                  >
                     {problem?.status &&
                        giveMyStatus({ status: problem?.status })}
                     {problem?.status &&
                        giveMyStatus({ status: problem?.status }) &&
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
               <div className="absolute bottom-0 w-full h-9 flex text-prim2 p-1 bg-black bg-opacity-30 rounded-[5px]  ">
                  <span className="flex h-full justify-center items-center mr-2 pl-2  bg-backg1 rounded-[5px] overflow-hidden">
                     {reactions?.isLiked === null ||
                     reactions?.isLiked === undefined ? (
                        <BiLike
                           onClick={() => {
                              problem &&
                                 updateUserLikeness({
                                    problemID: problem?.id,
                                    isLiked: true,
                                 });
                           }}
                           className="mr-2 hover:scale-125 transition-transform cursor-pointer"
                        />
                     ) : reactions?.isLiked ? (
                        <BiSolidLike className="mr-2 cursor-pointer" />
                     ) : (
                        <BiLike
                           onClick={() => {
                              problem &&
                                 updateUserLikeness({
                                    problemID: problem?.id,
                                    isLiked: true,
                                 });
                           }}
                           className="mr-2 hover:scale-125 transition-transform cursor-pointer"
                        />
                     )}
                     <span className="h-full flex items-center bg-opacity-10 bg-white px-2 ">
                        {reactions?.totalLikes}
                     </span>
                  </span>
                  <span className="flex h-full justify-center items-center mr-2 pl-2  bg-backg1 rounded-[5px] overflow-hidden">
                     {reactions?.isLiked === null ||
                     reactions?.isLiked === undefined ? (
                        <BiDislike
                           onClick={() => {
                              problem &&
                                 updateUserLikeness({
                                    problemID: problem?.id,
                                    isLiked: false,
                                 });
                           }}
                           className="mr-2 hover:scale-125 transition-transform cursor-pointer"
                        />
                     ) : !reactions?.isLiked ? (
                        <BiSolidDislike className="mr-2  transition-transform cursor-pointer" />
                     ) : (
                        <BiDislike
                           onClick={() => {
                              problem &&
                                 updateUserLikeness({
                                    problemID: problem?.id,
                                    isLiked: false,
                                 });
                           }}
                           className="mr-2 hover:scale-125 transition-transform cursor-pointer"
                        />
                     )}
                     <span className="h-full flex items-center bg-opacity-10 bg-white px-2 ">
                        {reactions?.totalDislikes}
                     </span>
                  </span>
                  {userId && (
                     <div
                        tabIndex={0}
                        ref={listsDropDown}
                        onBlur={(e) => {
                           handelListDropDown(e);
                        }}
                        className="relative h-full bg-backg1 rounded-[5px] px-1  "
                     >
                        <span
                           onClick={() => {
                              handelListsCalls({ key: "toggleListBlock" });
                           }}
                           className="w-full h-full hover:scale-125 transition-transform flex items-center"
                        >
                           <LiaClipboardListSolid size={20} />
                        </span>
                        <div
                           className={`${
                              listsView.block ? "absolute" : "hidden"
                           } bottom-9 w-[180px] p-1  max-h-[200px] bg-backg1 rounded-[5px] overflow-hidden`}
                        >
                           {listsView.lists ? (
                              <ul className=" capitalize max-h-[150px] px-1 mb-1 bg-white bg-opacity-20 rounded-sm overflow-y-auto">
                                 {lists?.map((list) => {
                                    return (
                                       <li
                                          key={list.id}
                                          onClick={() => {
                                             handelListSelectionForProblem({
                                                listId: list.id,
                                             });
                                          }}
                                          className="flex items-center hover:text-prim1 cursor-default"
                                       >
                                          <span className="bg-black bg-opacity-50 w-4 h-4 mr-2 rounded-sm flex items-center justify-center cursor-pointer">
                                             {selectedList[`${list.id}`] && (
                                                <BsCheck2Circle className="text-sm text-easy font-extrabold" />
                                             )}
                                          </span>
                                          {list.name}
                                          {selectedList[`${list.id}`]}
                                       </li>
                                    );
                                 })}
                              </ul>
                           ) : (
                              <ul className="relative capitalize w-full max-h-[150px] p-1 mb-1 bg-white bg-opacity-20 rounded-sm overflow-y-auto">
                                 <li
                                    onClick={() => {
                                       handelListsCalls({
                                          key: "openAllListsView",
                                       });
                                    }}
                                    className="w-full  flex items-center text-prim1 cursor-pointer"
                                 >
                                    <IoChevronBackSharp className="mr-2" /> Back
                                    to lists
                                 </li>
                                 <input
                                    type="text"
                                    value={newListName}
                                    placeholder="minimum 4 char.."
                                    onChange={(e) =>
                                       setNewListName(e.target.value)
                                    }
                                    className="relative outline-none h-7  text-prim2 w-full bg-backg2 rounded-sm !p-2"
                                 />
                              </ul>
                           )}
                           <span
                              onClick={() => {
                                 handelListsCalls({
                                    key: "openCreateNewListBlock",
                                 });
                              }}
                              className="inline-block text-center bg-white bg-opacity-10 w-full rounded-sm hover:text-prim1 cursor-pointer"
                           >
                              Create List
                           </span>
                        </div>
                     </div>
                  )}
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
