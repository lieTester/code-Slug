import React, { useContext, useEffect, useState, useRef } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
// functions
import {
   getAllLists,
   deleteList,
   updateListName,
} from "@/functions/ListFunctions";
import { addFilter } from "@/functions/FilterFunctions";
//hooks
// hooks
import useQueryParams from "@/hook/useQueryParams";
//context
import { SessionContext } from "@/context/SessionContext";
import { FiltersContext } from "@/context/FiltersContext";
import { ProblemContext } from "@/context/ProblemsContext";
import { listProp } from "@/types";
import { GetAllProblems } from "@/functions/ProblemFunctions";
import { DotLoader } from "../commonComponents/Loaders";

function ListSideBar() {
   // problem context ///////////////////////////////////////////////////////
   const problemContext = useContext(ProblemContext);
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // filter Context
   const filtersContext = useContext(FiltersContext);
   const { setQueryParams, removeQueryParams } = useQueryParams();

   const lists = filtersContext?.lists;
   const setLists = filtersContext?.setLists;
   const filterValues = filtersContext?.filterValues;
   const setFilterValues = filtersContext?.setFilterValues;

   const [selectedList, setSelectedList] = useState<{
      id: string;
      name: string;
      loader?: boolean;
   }>({ id: "", name: "" });
   const [open, setOpen] = useState<boolean>(false);

   const [isEdit, setIsEdit] = useState<boolean>(true);
   // get lists according to user presense
   const fetchData = async () => {
      const listsRes = await getAllLists(session?.user?.id);

      if (listsRes?.data?.lists && setLists) setLists(listsRes.data.lists);
   };

   const showDeleteList = async (id: string, name: string) => {
      setOpen(true);
      setIsEdit(false);
      setSelectedList(() => {
         return { id, name };
      });
   };
   const showEditList = async (id: string, name: string) => {
      setOpen(true);
      setIsEdit(true);
      setSelectedList(() => {
         return { id, name };
      });
   };

   const manageEditOrDeleteList = async (type: string) => {
      try {
         setSelectedList((prev) => {
            return { ...prev, loader: true };
         });
         if (type === "delete") {
            await deleteList(session?.user?.id, selectedList?.id);
         } else if (type === "edit") {
            await updateListName(
               session?.user?.id,
               selectedList?.id,
               selectedList?.name
            );
         }
      } catch (error) {
         console.error(error);
      } finally {
         // Find the list where id matches selectedListId
         // and we need before fetch called because after the will change
         const matchingList = lists?.find(
            ({ id }: listProp) => id === selectedList?.id
         );
         await fetchData().then(async () => {
            if (type === "edit" && matchingList?.name === filterValues?.list) {
               // above if condition of lists?.map is for if in filterValues we have
               // same list selected which we renamed then we do below step else nothing
               addFilter("list", selectedList?.name, filterValues);
               const query: Record<string, string> = {};
               query["list"] = selectedList?.name;
               setQueryParams(query);

               setFilterValues &&
                  setFilterValues((res) => {
                     return { ...res, list: selectedList?.name };
                  });
            } else if (
               type === "delete" &&
               matchingList?.name === filterValues?.list
            ) {
               const query: Record<string, string> = {};
               query["list"] = selectedList?.name;
               removeQueryParams(query);
               setFilterValues &&
                  setFilterValues((res) => {
                     return { ...res, list: "selectedList?.name" };
                  });
               const { problemCollection } = await GetAllProblems(
                  session?.user?.id
               );
               if (setCurrentListProblems && setFilterdProblems) {
                  setCurrentListProblems(problemCollection);
                  setFilterdProblems(problemCollection);
               }
            }
            onClose();
            setSelectedList({ id: "", name: "", loader: false });
         });
      }
   };
   const onClose = () => {
      setOpen(false);
   };
   return (
      <>
         <div className="h-full w-[40%] lg:w-[30%] border-secod1 border-[2px] rounded-md p-2 overflow-y-auto">
            {lists &&
               lists.map(({ name, slug, id, isPublic }) => {
                  return (
                     <ul
                        key={slug}
                        className={`relative bg-backg2 flex justify-between  w-full mb-2 rounded-md px-2 py-[2px] text-prim2    border-bordr1 border-[1px] truncate`}
                     >
                        <li className="relative w-[80%] truncate !p-0 [&>*]:!m-0">
                           <span className="block truncate text-prim1 capitalize font-baloo">
                              {name}
                           </span>
                           <span className="text-[12px] leading-[8px] !mt-[-5px]">
                              {isPublic ? "Public" : "Private"}
                           </span>
                        </li>
                        <li
                           onClick={() =>
                              isPublic === false && showEditList(id, name)
                           }
                           className={`${
                              isPublic ? "blur-sm" : "cursor-pointer"
                           } pt-3 text-xl text-medium `}
                        >
                           <MdEdit />
                        </li>
                        <li
                           onClick={() =>
                              isPublic === false && showDeleteList(id, name)
                           }
                           className={`${
                              isPublic ? "blur-sm" : "cursor-pointer"
                           } pt-3 text-xl text-hard `}
                        >
                           <MdDelete />
                        </li>
                     </ul>
                  );
               })}
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
               className={`${
                  isEdit ? "hidden" : "block"
               } min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-xl font-sofiaPro font-semibold mx-auto bg-black bg-opacity-25 backdrop-brightness-[.7] backdrop-blur-md`}
            >
               <div className="w-fit mx-auto">
                  Are You Sure You want to{" "}
                  <span className="text-hard">delete </span>
                  {selectedList?.name} ?
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
                        !selectedList?.loader &&
                           manageEditOrDeleteList("delete");
                     }}
                     className="w-24 text-easy border-[2px] border-secod1"
                  >
                     {selectedList?.loader ? <DotLoader /> : "Ok"}
                  </button>
               </div>
            </div>
            <div
               className={`${
                  isEdit ? "block" : "hidden"
               } min-w-[30%] py-10 px-8 rounded-md  text-prim2 z-[100] text-xl font-sofiaPro font-semibold mx-auto bg-black bg-opacity-25 backdrop-brightness-[.7] backdrop-blur-md`}
            >
               <input
                  type="text"
                  className="w-full mx-auto bg-transparent rounded-md font-normal   p-1 px-2 outline-none text-prim1 border-[2px] border-secod1"
                  value={selectedList ? selectedList.name : ""}
                  onChange={(e) => {
                     setSelectedList((prev: { id: string; name: string }) => {
                        return { ...prev, name: e.target.value };
                     });
                  }}
               />

               <div className="mt-4 flex justify-around [&>*]:px-2 [&>*]:py-1 [&>*]:rounded-md">
                  <button
                     onClick={onClose}
                     className="w-24 text-hard border-[2px] border-secod1"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={() => {
                        !selectedList?.loader && manageEditOrDeleteList("edit");
                     }}
                     className="w-24 text-easy border-[2px] border-secod1"
                  >
                     {selectedList?.loader ? <DotLoader /> : "Ok"}
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}

export default ListSideBar;
