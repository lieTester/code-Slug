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
import FilterIcons from "@/components/commonComponents/Filter/FilterIcons";
// function
import { getAllLists, getSelectList } from "@/functions/ListFunctions";
import { getAllTopics } from "@/functions/TopicFunctions";
import { getAllCompanylist } from "@/functions/CompanyFunctions";
import { GetAllProblems } from "@/functions/ProblemFunctions";
import {
   addFilter,
   removeFilter,
   applyFilter,
} from "@/functions/FilterFunctions";
//types
import { companieProp, ProblemsProp, topicProp } from "@/types/index";
// hooks
import useQueryParams from "@/hook/useQueryParams";
import { FiltersContext } from "@/context/FiltersContext";

const ProblemFilters = () => {
   // problem context ///////////////////////////////////////////////////////
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   const setCurrentListDetail = problemContext?.setCurrentListDetail;
   const filterdProblems = problemContext?.filterdProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const setCurrentPageProblemSet = problemContext?.setCurrentPageProblemSet;
   const setProblemSetLoading = problemContext?.setProblemSetLoading;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   // session context ////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   // filter context /////////////////////////////////////////////////////////
   const filtersContext = useContext(FiltersContext);

   const searchParams = useSearchParams();
   const { setQueryParams, removeQueryParams, urlSearchParams } =
      useQueryParams();

   const lists = filtersContext?.lists;
   const setLists = filtersContext?.setLists;
   const topics = filtersContext?.topics;
   const setTopics = filtersContext?.setTopics;
   const companies = filtersContext?.companies;
   const setCompanies = filtersContext?.setCompanies;
   const isTopic = filtersContext?.isTopic;
   const setIsTopic = filtersContext?.setIsTopic;
   const difficulty = filtersContext?.difficulty;
   const status = filtersContext?.status;

   // above filter data management states ///////////////////////////////////
   const filterValues = filtersContext?.filterValues;
   const setFilterValues = filtersContext?.setFilterValues;
   const filterVisiblity = filtersContext?.filterVisiblity;
   const setFilterVisiblity = filtersContext?.setFilterVisiblity;
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
      if ((currentList.length || goAhead) && page) {
         const totalPages = Math.ceil(currentList?.length / page.pageSize);
         const currPage = pageNumber || page.currPage;
         setPage &&
            setPage((prev: any) => {
               return {
                  ...prev,
                  // currPage: currPage % (totalPages + 1),
                  currPage: Math.max(1, Math.min(currPage, totalPages)),
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
            const result = await getSelectList({
               listId: currentListId,
               userId: session?.user?.id,
            }).catch((err) => {
               throw err;
            });
            currentList = result.currentList;
         } else {
            const { problemCollection } = await GetAllProblems({
               userId: id,
            }).catch((err) => {
               throw err;
            });
            currentList = problemCollection;
         }

         if (setCurrentListProblems && setFilterdProblems) {
            setCurrentListProblems(currentList);
            setFilterdProblems(currentList);
         }

         return { currentList };
      } catch (error) {
         console.error("Error in getBase:", error);
         throw error;
      }
   }

   const removeFilterVisiblity = () => {
      setFilterVisiblity && setFilterVisiblity(null);
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
      try {
         await applyFilter({
            filterValues,
            filteredProblemsList: currentListProblems,
         }).then(({ filteredProblemsList }) => {
            if (filteredProblemsList.length === 0 && setProblemSetLoading)
               setTimeout(() => {
                  setProblemSetLoading({ loading: false });
               }, 300);
            // why goAhead is true here is because here if we got list 0 we should change page setup
            // and page cannot perform if list is empty so goAhead is to tackle that scenario
            const pageNumber = parseInt(searchParams?.get("pageno") || "1");
            performPageSetup({
               currentList: filteredProblemsList,
               pageNumber,
               goAhead: true,
            });
            setFilterdProblems && setFilterdProblems(filteredProblemsList);
         });
      } catch (error) {
         console.error(error);
      }
   };
   const catchFilter = async (category: string, value: string, id?: any) => {
      try {
         if (setProblemSetLoading && category !== "search") {
            manageFiltersInUrl({
               type: "add",
               category,
               value,
            });
            setProblemSetLoading({ loading: true, value: category }); // to make skeleton loading animation
         }

         // if FiterValues is not undefined
         filterValues &&
            (await addFilter({
               category,
               value,
               filterValues,
            })
               .then(async ({ filterValues }) => {
                  setFilterValues &&
                     setFilterValues((prev) => {
                        return { ...prev, ...filterValues };
                     });
                  if (category === "list") {
                     const { currentList } = await getSelectList({
                        listId: id,
                        userId: session?.user?.id,
                     });
                     processFilters(filterValues, currentList);
                     if (setCurrentListProblems && setFilterdProblems) {
                        setCurrentListProblems(currentList);
                        setFilterdProblems(currentList);
                     }
                  } else {
                     processFilters(filterValues, currentListProblems);
                  }
               })
               .catch((err) => {
                  throw err;
               }));
         removeFilterVisiblity(); // becuse on click the filter data is
      } catch (error) {
         console.error(error);
      }
   };
   const fireFilter = async ({
      category,
      value,
      id,
   }: {
      category: string;
      value: string;
      id?: any;
   }) => {
      try {
         if (setProblemSetLoading) {
            manageFiltersInUrl({
               type: "remove",
               category,
               value,
            });
            setProblemSetLoading({ loading: true, value: category });
         }
         filterValues &&
            (await removeFilter({ category, value, filterValues })
               .then(async ({ filterValues }) => {
                  setFilterValues &&
                     setFilterValues((prev) => {
                        return { ...prev, ...filterValues };
                     });
                  if (category === "list") {
                     await getBase(session?.user?.id)
                        .then(({ currentList }) => {
                           processFilters(filterValues, currentList);
                        })
                        .catch((error) => {
                           throw error;
                        });
                     setCurrentListDetail &&
                        setCurrentListDetail(() => {
                           return {};
                        });
                  } else {
                     processFilters(filterValues, currentListProblems);
                  }
               })
               .catch((error) => {
                  throw error;
               }));
      } catch (error) {
         console.error(error);
      }
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
            const topicsRes = await getAllTopics().catch((error) => {
               throw error;
            });
            topicsRes &&
               topicsRes.data.topics.sort((a: topicProp, b: topicProp) =>
                  a.name.localeCompare(b.name)
               );
            setTopics && setTopics(topicsRes.data.topics);

            const companiesRes = await getAllCompanylist().catch((error) => {
               throw error;
            });
            companiesRes &&
               companiesRes.data.companies.sort(
                  (a: companieProp, b: companieProp) =>
                     a.name.localeCompare(b.name)
               );
            setCompanies && setCompanies(companiesRes.data.companies);

            if (session !== undefined && currentListProblems?.length === 0) {
               // get lists according to user presense
               const listsRes = await getAllLists({
                  userId: session?.user?.id,
               }).catch((error) => {
                  throw error;
               });
               setLists && setLists(listsRes.data.lists);

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
                     if (key === "list") {
                        // lists.data.res is above in this same function
                        // its important to enter list in setCurrentListDetail if in url to make baseListHolder in listLanding to
                        // to show delete symbol for private lists
                        listsRes.data.lists?.map(
                           ({ name, id, isPublic }: any) => {
                              if (value === name) {
                                 setCurrentListDetail &&
                                    setCurrentListDetail(() => {
                                       return { isPublic, id };
                                    });
                              }
                           }
                        );
                     }
                  }
               }
               // check if session is thier or not if not and url have list possible that it's user list
               // or not but will prevent getting it
               if (session === null) delete captureUrlFilterValue["list"];
               setFilterValues && setFilterValues(captureUrlFilterValue);

               let currentListId: string | null = null;
               if (captureUrlFilterValue?.list && session !== null) {
                  listsRes.data.lists.map((item: any) => {
                     if (item.name === captureUrlFilterValue?.list)
                        currentListId = item.id;
                  });
               }

               await getBase(session?.user?.id, currentListId)
                  .then(({ currentList }) => {
                     processFilters(captureUrlFilterValue, currentList);
                  })
                  .catch((error) => {
                     throw error;
                  });
            }
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [session]);

   useEffect(() => {
      if (filterdProblems && setCurrentPageProblemSet && page) {
         const problems: any[] = filterdProblems.slice(
            (page.currPage - 1) * page.pageSize,
            page.currPage * page.pageSize
         );
         setCurrentPageProblemSet(problems); // Update problemSet
      }
   }, [page, filterdProblems]);

   // change the problemSet according to page and filter
   useEffect(() => {
      if (Number(searchParams?.get("pageno")) !== page?.currPage) {
         const pageNumber = parseInt(searchParams?.get("pageno") || "1");
         performPageSetup({ pageNumber });
      }
   }, [searchParams?.get("pageno")]);

   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////    Below JSX Section      ////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   return (
      <section className="w-full md:pl-2">
         <ul className="w-full relative grid grid-cols-1 gap-x-2 gap-y-1 md:grid-cols-2 lg:flex lg:justify-end flex-wrap  [&>*]:flex [&>*]:items-center [&>*]:mb-1  [&>*]:lg:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-secod3 text-prim2 ">
            <li
               className="relative  flex justify-between cursor-pointer focus:z-[20]"
               tabIndex={0}
               onClick={() => {
                  setFilterVisiblity &&
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
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-front2  transition-[opacity,transform]`}
               >
                  {lists &&
                     lists.map(({ name, slug, id, isPublic }) => {
                        return (
                           <li
                              className="truncate hover:bg-secod2 mt-1 rounded-sm px-1"
                              key={slug}
                              onClick={() => {
                                 catchFilter("list", name, id);
                                 setCurrentListDetail &&
                                    setCurrentListDetail(() => {
                                       return { isPublic, id };
                                    });
                              }}
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
                  setFilterVisiblity &&
                     setFilterVisiblity((prev: any) => {
                        return {
                           difficulty: prev?.difficulty
                              ? !prev?.difficulty
                              : true,
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
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-front2  transition-[opacity,transform]`}
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
                              } truncate hover:bg-secod2 mt-1 rounded-sm px-1`}
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
                  setFilterVisiblity &&
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
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-front2  transition-[opacity,transform]`}
               >
                  {status &&
                     status.map((val, index) => {
                        return (
                           <li
                              className={`${
                                 val === "Solved"
                                    ? "text-easy"
                                    : val === "Attempted" && "text-medium"
                              } truncate flex  items-center hover:bg-secod2 mt-1 rounded-sm px-1`}
                              key={index}
                              onClick={() => catchFilter("status", val)}
                           >
                              {val === "Solved" ? (
                                 <BsCheck2Circle className="mr-2 p-[2px] text-[20px] " />
                              ) : val === "Attempted" ? (
                                 <IoIosCodeWorking className="mr-2 p-[2px] text-[20px] " />
                              ) : (
                                 <BsCalendarMinus className="mr-2 p-[2px] text-[18px] " />
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
               onClick={() => {
                  setFilterVisiblity &&
                     setFilterVisiblity((prev: any) => {
                        return { list: prev?.list ? !prev?.list : true };
                     });
               }}
               onBlur={removeFilterVisiblity}
            >
               Tags
               <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
               <ul className="absolute top-10 right-0 w-full md:w-[350px] max-w-xl h-[500px] overflow-hidden p-2 my-auto rounded-md -translate-y-2 invisible opacity-0 bg-front2 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-[opacity,transform]">
                  <li className="h-[6%] flex items-center bg-secod2 rounded-sm mb-2">
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
                           onClick={() => setIsTopic && setIsTopic(true)}
                        >
                           Topics
                        </li>
                        <li
                           className={`${
                              !isTopic && "text-prim1 border-b-2"
                           } px-1 mr-1`}
                           onClick={() => setIsTopic && setIsTopic(false)}
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
                                      className=" text-sm h-fit px-2 rounded-full mr-1 mb-2 bg-secod2"
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
                                      className=" text-sm px-2 rounded-full mr-1 mb-2 bg-secod2"
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
         <ul className="py-2 px-1 w-full flex flex-wrap text-prim1 list-none [&>*]:mr-2 [&>*]:px-1 [&>*]:py-[2px]">
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
