import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
// icons
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io"; // Import your desired filter icon
import { IoIosCodeWorking } from "react-icons/io";
import { BsCalendarMinus, BsCheck2Circle } from "react-icons/bs";
//context
import { SessionContext } from "@/context/SessionContext";
import { ProblemContext } from "@/context/ProblemsContext";
// component
import FilterIcons from "@/components/subcomponent/Filter/FilterIcons";
// function
import { getAllLists, getSelectList } from "@/functions/ListFunctions";
import { getAllTags } from "@/functions/TagFunctions";
import { getAllCompanylist } from "@/functions/CompanyFunctions";
import { GetAllProblems } from "@/functions/ProblemFunctions";
import {
   addFilter,
   removeFilter,
   applyFilter,
} from "@/functions/FilterFunctions";
//types
import { ProblemsProp, filterProps } from "@/types/index";
// hooks
import useQueryParams from "@/hook/useQueryParams";

const ProblemFilters = () => {
   // problem context ///////////////////////////////////////////////////////
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   const filterdProblems = problemContext?.filterdProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const setCurrentPageProblemSet = problemContext?.setCurrentPageProblemSet;
   const setProblemSetLoading = problemContext?.setProblemSetLoading;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // filters states /////////////////////////////////////////////////////////
   const { setQueryParams, removeQueryParams, urlSearchParams } =
      useQueryParams();
   const [lists, setLists] = useState<any[]>();
   const [topics, setTopics] = useState<any[]>();
   const [companies, setCompanies] = useState<any[]>();
   const [isTopic, setIsTopic] = useState(true);
   const difficulty = ["Easy", "Medium", "Hard"];
   const status = ["Todo", "Solved", "Attempted"];
   // above filter data management states ///////////////////////////////////
   const [filterValues, setFilterValues] = useState<filterProps>({});
   const [filterVisiblity, setFilterVisiblity] = useState<any>(null);

   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////// all functions /////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   const performPageSetup = async ({
      currentList,
      pageNumber,
      goAhead,
   }: {
      currentList?: any;
      pageNumber?: number;
      goAhead?: boolean;
   }) => {
      currentList = currentList || filterdProblems;

      // will only receive goAhead when a filter func call and if filterd list is empty
      // to show pagination propperly
      if (currentList.length || goAhead) {
         const totalPages = Math.ceil(currentList?.length / page.pageSize);
         const currPage = pageNumber || page.currPage || 1;
         // ||1 is most important because in case we have empty list after filter so we shown pagination ccorrectly
         // but because list is empty currPage%(ttlPages+1) make it currPage:0
         // and below useEffect to slice problem will not work for it to work properly currPage:1 is minimum criteria
         // and as next time list will be having lenght>0 then over setProblemSetLoading will only call
         // after useEffect slice and setProblemSetLoading will call from main.tsx file
         setPage &&
            setPage((prev: any) => {
               return {
                  ...prev,
                  currPage: currPage % (totalPages + 1),
                  totalPages: totalPages,
               };
            });
      }
   };
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // base data collection at loading time and also if previous list filter removed//////////////////////////////////
   async function getBase(id: string | null, currentListId?: string | null) {
      try {
         let currentList: ProblemsProp[] = [];

         if (currentListId) {
            const result = await getSelectList(
               currentListId,
               session?.user?.id
            );
            currentList = result.currentList;
         } else {
            const { problemCollection } = await GetAllProblems(id);
            currentList = problemCollection;
         }

         if (setCurrentListProblems && setFilterdProblems) {
            setCurrentListProblems(currentList);
            setFilterdProblems(currentList);
         }

         performPageSetup({ currentList });
         return { currentList };
      } catch (error) {
         console.error("Error in getBase:", error);
         throw error;
      }
   }

   const removeFilterVisiblity = () => {
      setFilterVisiblity(null);
   };

   const manageFiltersInUrl = ({
      type,
      category,
      value,
   }: {
      type: string;
      category: string;
      value: string;
   }) => {
      const query: Record<string, string> = {};
      query[category] = value;

      if (type === "add") {
         setQueryParams(query);
      } else {
         removeQueryParams(query);
      }
   };
   const processFilters = async (
      filterValues: any,
      currentListProblems: any
   ) => {
      await applyFilter(filterValues, currentListProblems).then(
         ({ filteredProblemsList }) => {
            if (filteredProblemsList.length === 0 && setProblemSetLoading)
               setTimeout(() => {
                  setProblemSetLoading({ loading: false });
               }, 300);
            // why goAhead is true here is because here if we got list 0 we should change page setup
            // and page cannot perform if list is empty so goAhead is to tackle that scenario
            performPageSetup({
               currentList: filteredProblemsList,
               goAhead: true,
            });
            setFilterdProblems && setFilterdProblems(filteredProblemsList);
         }
      );
   };
   const catchFilter = async (category: string, value: string, id?: any) => {
      if (setProblemSetLoading && category !== "search") {
         manageFiltersInUrl({
            type: "add",
            category,
            value,
         });
         setProblemSetLoading({ loading: true, value: category }); // to make skeleton loading animation
      }
      await addFilter(category, value, filterValues).then(
         async ({ filterValues }) => {
            setFilterValues((prev) => {
               return { ...prev, ...filterValues };
            });
            if (category === "list") {
               const { currentList } = await getSelectList(
                  id,
                  session?.user?.id
               );
               processFilters(filterValues, currentList);
               if (setCurrentListProblems && setFilterdProblems) {
                  setCurrentListProblems(currentList);
                  setFilterdProblems(currentList);
               }
            } else {
               processFilters(filterValues, currentListProblems);
            }
         }
      );
      removeFilterVisiblity(); // becuse on click the filter data is
   };
   const fireFilter = async (category: string, value: string, id?: any) => {
      if (setProblemSetLoading) {
         manageFiltersInUrl({
            type: "remove",
            category,
            value,
         });
         setProblemSetLoading({ loading: true, value: category });
      }
      await removeFilter(category, value, filterValues).then(
         async ({ filterValues }) => {
            setFilterValues((prev) => {
               return { ...prev, ...filterValues };
            });
            if (category === "list") {
               await getBase(session?.user?.id)
                  .then(({ currentList }) => {
                     processFilters(filterValues, currentList);
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            } else {
               processFilters(filterValues, currentListProblems);
            }
         }
      );
   };

   let debounceTimeout: any;
   const filterByTitle = async (value: string) => {
      // Clear the previous timeout
      clearTimeout(debounceTimeout);
      // Set a new timeout to trigger the search after a delay
      debounceTimeout = setTimeout(() => {
         catchFilter("search", value);
      }, 800);
   };

   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////// all useEffect /////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   useEffect(() => {
      const fetchData = async () => {
         try {
            const tagsRes = await getAllTags();
            setTopics(tagsRes.data.tags);

            const companiesRes = await getAllCompanylist();
            setCompanies(companiesRes.data.companies);

            if (session !== undefined && currentListProblems?.length === 0) {
               // get lists according to user presense
               const listsRes = await getAllLists(session?.user?.id);
               setLists(listsRes.data.lists);

               // get filters values from url
               const iterator = urlSearchParams.entries();
               const entriesArray = Array.from(iterator);
               const captureUrlFilterValue = {} as {
                  [key: string]: string | string[];
               };
               for (const [key, value] of entriesArray) {
                  if (key === "topics" || key === "companies") {
                     captureUrlFilterValue[key] = value.split("~");
                  } else {
                     captureUrlFilterValue[key] = value;
                  }
               }
               // check if session is thier or not if not and url have list possible that it's user list
               // or not but will prevent getting it
               if (session === null) delete captureUrlFilterValue["list"];
               setFilterValues(captureUrlFilterValue);

               let currentListId: string | null = null;
               if (captureUrlFilterValue?.list && session !== null) {
                  listsRes.data.lists.map((item: any) => {
                     if (item.name === captureUrlFilterValue?.list)
                        currentListId = item.id;
                  });
               }

               await getBase(session?.user?.id, currentListId).then(
                  ({ currentList }) => {
                     processFilters(captureUrlFilterValue, currentList);
                  }
               );
            }
         } catch (error) {
            console.error("Error in useEffect:", error);
         }
      };

      fetchData();
   }, [session]);

   useEffect(() => {
      if (filterdProblems && setCurrentPageProblemSet) {
         const problems: any[] = filterdProblems.slice(
            (page.currPage - 1) * page.pageSize,
            page.currPage * page.pageSize
         );
         setCurrentPageProblemSet(problems); // Update problemSet
      }
   }, [page, filterdProblems]);

   // change the problemSet according to page and filter
   const searchParams = useSearchParams();
   useEffect(() => {
      if (searchParams?.get("pageno") !== page.currPage) {
         const pageNumber = parseInt(searchParams?.get("pageno") || "1");
         performPageSetup({ pageNumber });
      }
   }, [searchParams]);

   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////    Below JSX Section      ////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   return (
      <section className="w-full z-[20]">
         <ul className="w-full relative z-[20] flex justify-end flex-wrap [&>*]:flex [&>*]:mb-1 [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-seco2 text-prim2 ">
            <li
               className="relative  flex justify-between cursor-pointer focus:z-[20]"
               tabIndex={0}
               onClick={() => {
                  setFilterVisiblity((prev: any) => {
                     return { list: prev?.list ? !prev?.list : true };
                  });
               }}
               onBlur={removeFilterVisiblity}
            >
               Lists
               <IoMdArrowDropdown
                  className={`ml-3  hover:cursor-pointer ${
                     filterVisiblity?.list && "rotate-180"
                  } transition-[transform] ease-linear`}
               />
               <ul
                  className={`${
                     filterVisiblity?.list
                        ? "visible opacity-100 translate-y-0"
                        : "-translate-y-2 invisible opacity-0 "
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-seco2  transition-[opacity,transform]`}
               >
                  {lists &&
                     lists.map(({ name, slug, id }) => {
                        return (
                           <li
                              className="truncate hover:bg-extra1 mt-1 rounded-sm px-1"
                              key={slug}
                              onClick={() => catchFilter("list", name, id)}
                           >
                              {name}
                           </li>
                        );
                     })}
               </ul>
            </li>
            <li
               className="relative flex justify-between cursor-pointer focus:z-[20]"
               tabIndex={0}
               onClick={() => {
                  setFilterVisiblity((prev: any) => {
                     return {
                        difficulty: prev?.difficulty ? !prev?.difficulty : true,
                     };
                  });
               }}
               onBlur={removeFilterVisiblity}
            >
               Difficulty
               <IoMdArrowDropdown
                  className={`ml-3 hover:cursor-pointer ${
                     filterVisiblity?.difficulty && "rotate-180"
                  } transition-[transform] ease-linear`}
               />
               <ul
                  className={`${
                     filterVisiblity?.difficulty
                        ? "visible opacity-100 translate-y-0"
                        : "-translate-y-2 invisible opacity-0 "
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-seco2  transition-[opacity,transform]`}
               >
                  {difficulty &&
                     difficulty.map((val, index) => {
                        return (
                           <li
                              className={`${
                                 val === "Easy"
                                    ? "text-easy"
                                    : val === "Medium"
                                    ? "text-medium"
                                    : "text-hard"
                              } truncate hover:bg-extra1 mt-1 rounded-sm px-1`}
                              key={index}
                              onClick={() => catchFilter("difficulty", val)}
                           >
                              {val}
                           </li>
                        );
                     })}
               </ul>
            </li>
            <li
               className="relative flex justify-between cursor-pointer focus:z-[20]"
               tabIndex={0}
               onClick={() => {
                  setFilterVisiblity((prev: any) => {
                     return { status: prev?.status ? !prev?.status : true };
                  });
               }}
               onBlur={removeFilterVisiblity}
            >
               Status
               <IoMdArrowDropdown
                  className={`ml-3 hover:cursor-pointer ${
                     filterVisiblity?.status && "rotate-180"
                  } transition-[transform] ease-linear`}
               />
               <ul
                  className={`${
                     filterVisiblity?.status
                        ? "visible opacity-100 translate-y-0"
                        : "-translate-y-2 invisible opacity-0 "
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-seco2  transition-[opacity,transform]`}
               >
                  {status &&
                     status.map((val, index) => {
                        return (
                           <li
                              className={`${
                                 val === "Solved"
                                    ? "text-easy"
                                    : val === "Attempted" && "text-medium"
                              } truncate flex  items-center hover:bg-extra1 mt-1 rounded-sm px-1`}
                              key={index}
                              onClick={() => catchFilter("status", val)}
                           >
                              {val === "Solved" ? (
                                 <BsCheck2Circle className="mr-2 p-[2px]" />
                              ) : val === "Attempted" ? (
                                 <IoIosCodeWorking className="mr-2 p-[2px]" />
                              ) : (
                                 <BsCalendarMinus className="mr-2 p-[2px]" />
                              )}

                              {val}
                           </li>
                        );
                     })}
               </ul>
            </li>

            <li
               className="relative flex justify-between cursor-pointer group focus-within:z-[20]"
               tabIndex={0}
            >
               Tags
               <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
               <ul className="absolute top-10 right-0 w-full md:w-[350px] max-w-xl h-[500px] overflow-hidden p-2 my-auto rounded-md -translate-y-2 invisible opacity-0 bg-seco2 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-[opacity,transform]">
                  <li className="h-[6%] flex items-center bg-extra1 rounded-sm mb-2">
                     <IoMdSearch className="m-2" />
                     <input
                        className="w-full bg-transparent outline-none"
                        placeholder="Search tags..."
                        type="text"
                     />
                  </li>
                  <div className="relative h-[92%] overflow-hidden ">
                     <ul className="relative h-[10%] [&>*]:inline ">
                        <li
                           className={`${
                              isTopic && "text-prim1 border-b-2"
                           } px-1 mr-1`}
                           onClick={() => setIsTopic(true)}
                        >
                           Topics
                        </li>
                        <li
                           className={`${
                              !isTopic && "text-prim1 border-b-2"
                           } px-1 mr-1`}
                           onClick={() => setIsTopic(false)}
                        >
                           Companies
                        </li>
                     </ul>
                     <ul className="relative  !overflow-y-auto flex justify-between flex-wrap w-full h-[90%] py-2 [&>li]:opacity-70 [&>li:hover]:opacity-100 [&>li:hover]:text-prim1 ">
                        {isTopic
                           ? topics?.map(({ name, slug }) => {
                                return (
                                   <li
                                      key={slug}
                                      className=" text-sm h-fit px-2 rounded-full mr-1 mb-2 bg-extra1"
                                      onClick={() =>
                                         catchFilter("topics", name)
                                      }
                                   >
                                      {name}
                                   </li>
                                );
                             })
                           : companies?.map(({ name, slug }) => {
                                return (
                                   <li
                                      key={slug}
                                      className=" text-sm px-2 rounded-full mr-1 mb-2 bg-extra1"
                                      onClick={() =>
                                         catchFilter("companies", name)
                                      }
                                   >
                                      {name}
                                   </li>
                                );
                             })}
                     </ul>
                  </div>
               </ul>
            </li>

            <li className="w-40 focus-within:w-60 transition-all duration-500">
               <IoMdSearch className="mr-3" />
               <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search problem..."
                  onChange={(e) => filterByTitle(e.target.value)}
               />
            </li>
         </ul>
         <ul className="p-2 w-full flex flex-wrap text-prim1 list-none [&>*]:m-1 [&>*]:px-1 [&>*]:py-[2px]">
            {filterValues && (
               <FilterIcons
                  filterValues={filterValues}
                  fireFilter={fireFilter}
               />
            )}
         </ul>
      </section>
   );
};

export default ProblemFilters;
