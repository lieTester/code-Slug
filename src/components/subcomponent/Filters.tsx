import React, { useEffect, useState, useContext } from "react";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io"; // Import your desired filter icon
import { useSearchParams } from "next/navigation";
import { SessionContext } from "@/context/SessionContext";
import { ProblemContext } from "@/context/ProblemsContext";
import FilterIcons from "@/components/subcomponent/FilterIcons";
// function
import { getAllLists, getSelectList } from "@/functions/ListFunctions";
import { getAllTags } from "@/functions/TagFunctions";
import { getAllCompanylist } from "@/functions/CompanyFunctions";
import { GetAllProblems } from "@/functions/ProblemFunctions";
import { addFilter, removeFilter } from "@/functions/FilterFunctions";
import { ProblemsProp, filterProps } from "@/types/index";
const Filters = () => {
   ////////////////////////////////////////////////////////////////
   // problem context
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   const setCurrentListProblems = problemContext?.setCurrentListProblems;
   const setCurrentPageProblemSet = problemContext?.setCurrentPageProblemSet;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   // session context
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;
   // filters related states and functions
   const [lists, setLists] = useState<any[]>();
   const [topics, setTopics] = useState<any[]>();
   const [companies, setCompanies] = useState<any[]>();
   const [isTopic, setIsTopic] = useState(true);
   const dificulty = ["Easy", "Medium", "Hard"];
   const status = ["Todo", "Solved", "Attempted"];
   // above filter data management
   const [filterValues, setFilterValues] = useState<filterProps>({});
   const [filterVisiblity, setFilterVisiblity] = useState<any>(null);

   // UseEffects  //////////////////////////////////
   // base data collection at loading time
   useEffect(() => {
      getAllTags().then((res: any) => setTopics(res.data.tags));
      getAllCompanylist().then((res: any) => setCompanies(res.data.companies));

      async function getBase(email: string | null) {
         // get all problems if user is logged in fetch its problem status as well
         const { problemCollection } = await GetAllProblems(email);
         if (setCurrentListProblems) setCurrentListProblems(problemCollection);

         // get lists according to user pressence
         getAllLists(email).then((res: any) => {
            setLists(res.data.lists);
         });
         if (setPage) {
            setPage((prev: any) => {
               return {
                  ...prev,
                  totalPages: problemCollection.length / page.pageSize,
               };
            });
         }
      }
      if (session !== undefined) {
         getBase(session?.user?.email).catch((error) => {
            console.log(error);
         });
      }
   }, [session]);
   useEffect(() => {
      if (currentListProblems && setCurrentPageProblemSet) {
         const problems: any[] = currentListProblems.slice(
            (page.currPage - 1) * page.pageSize,
            page.currPage * page.pageSize
         );

         if (problems) setCurrentPageProblemSet(problems); // Update problemSet
      }
   }, [page, currentListProblems]);

   // change the problemSet according to page and filter
   const searchParams = useSearchParams();
   useEffect(() => {
      if (setPage && page.totalPages) {
         const pagenumber = searchParams?.get("page") || "1";
         setPage((prev: any) => {
            return {
               ...prev,
               currPage: parseInt(pagenumber) % page.totalPages,
               // mod is if someone wants to mess with url
            };
         });
      }
   }, [searchParams?.get("page")]);

   // all functions //////////////////////////////////
   const removeFilterVisiblity = () => {
      setFilterVisiblity(null);
   };
   const catchFilter = async (category: string, value: string, id?: any) => {
      if (category === "list") {
         await getSelectList(id).then((selectList) => {
            console.log(selectList);
         });
      }
      await addFilter(category, value, filterValues).then(({ filters }) => {
         setFilterValues((prev) => {
            return { ...prev, ...filters };
         });
      });
      removeFilterVisiblity(); // becuse on click the filter data is
   };
   const fireFilter = async (category: string, value: string, id?: any) => {
      await removeFilter(category, value, filterValues).then(({ filters }) => {
         setFilterValues((prev) => {
            return { ...prev, ...filters };
         });
      });
   };

   return (
      <section className="w-full z-[20]">
         <ul className="w-full relative z-[20] flex justify-end [&>*]:flex [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-seco2 text-prim2 ">
            <li
               className="relative cursor-pointer "
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
                  className={`ml-3 hover:cursor-pointer ${
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
               className="relative cursor-pointer group"
               tabIndex={0}
               onClick={() => {
                  setFilterVisiblity((prev: any) => {
                     return {
                        dificulty: prev?.dificulty ? !prev?.dificulty : true,
                     };
                  });
               }}
               onBlur={removeFilterVisiblity}
            >
               Dificulty
               <IoMdArrowDropdown
                  className={`ml-3 hover:cursor-pointer ${
                     filterVisiblity?.dificulty && "rotate-180"
                  } transition-[transform] ease-linear`}
               />
               <ul
                  className={`${
                     filterVisiblity?.dificulty
                        ? "visible opacity-100 translate-y-0"
                        : "-translate-y-2 invisible opacity-0 "
                  } absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md   bg-seco2  transition-[opacity,transform]`}
               >
                  {dificulty &&
                     dificulty.map((val, index) => {
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
                              onClick={() => catchFilter("dificulty", val)}
                           >
                              {val}
                           </li>
                        );
                     })}
               </ul>
            </li>
            <li
               className="relative cursor-pointer group"
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
                              } truncate hover:bg-extra1 mt-1 rounded-sm px-1`}
                              key={index}
                              onClick={() => catchFilter("status", val)}
                           >
                              {val}
                           </li>
                        );
                     })}
               </ul>
            </li>

            <li className="relative cursor-pointer group" tabIndex={0}>
               Tags
               <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
               <ul className="absolute top-10 right-0 w-[350px] max-w-xl h-[500px] overflow-hidden p-2 my-auto rounded-md -translate-y-2 invisible opacity-0 bg-seco2 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-[opacity,transform]">
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
                                      onClick={() => catchFilter("topic", name)}
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
                                         catchFilter("company", name)
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
                  type="text"
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

export default Filters;
