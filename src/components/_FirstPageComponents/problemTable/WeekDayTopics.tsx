import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
// context
import { FiltersContext } from "@/context/FiltersContext";
import { ProblemContext } from "@/context/ProblemsContext";
import { SessionContext } from "@/context/SessionContext";
import { getUserTopicsOfUser } from "@/functions/CalendarFunctions";
// functions
import { addFilter, applyFilter } from "@/functions/FilterFunctions";
import useQueryParams from "@/hook/useQueryParams";

const WeekDayTopics: React.FC = () => {
   // session context /////////////////////////////////////////////////////////
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;
   // filter context /////////////////////////////////////////////////////////
   const filtersContext = useContext(FiltersContext);

   // above filter data management states ///////////////////////////////////
   const filterValues = filtersContext?.filterValues;
   const setFilterValues = filtersContext?.setFilterValues;
   const setFilterVisiblity = filtersContext?.setFilterVisiblity;

   const [dayTopics, setDayTopics] = useState<{
      id: number;
      name: string;
      topics: {
         id: string;
         name: string;
      }[];
   }>();
   const [isSelected, setIsSelected] = useState<{ [key: string]: boolean }>({});

   // Memoize userId so it only updates when session?.user?.id actually changes
   const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
   const fetchData = async () => {
      try {
         await getUserTopicsOfUser({ userId: userId }).then((data) => {
            const formatData: {} = data.formattedTodayTopics.topics.map(
               ({ id, name }: { id: number; name: string }) => {
                  return { [name]: false };
               }
            );
            setIsSelected(formatData);
            setDayTopics(data.formattedTodayTopics);
         });
      } catch (error) {
         console.error(error);
      }
   };
   useEffect(() => {
      fetchData();
   }, [userId]);
   useEffect(() => {
      // Set all to false initially
      setIsSelected((prev) => {
         const updated = { ...prev };

         // Set all keys to false
         Object.keys(updated).forEach((key) => {
            updated[key] = false;
         });

         // If a topic is in filterValues, set it to true
         filterValues?.topics?.forEach((name) => {
            if (updated[name] !== undefined) {
               updated[name] = true;
            }
         });

         return updated;
      });
   }, [filterValues?.topics]);

   ////////////////////////////////////////////////////////////////////////////////////////////////
   // problem context ///////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   const problemContext = useContext(ProblemContext);
   const currentListProblems = problemContext?.currentListProblems;
   const filterdProblems = problemContext?.filterdProblems;
   const setFilterdProblems = problemContext?.setFilterdProblems;
   const setProblemSetLoading = problemContext?.setProblemSetLoading;
   const page = problemContext?.page;
   const setPage = problemContext?.setPage;

   const searchParams = useSearchParams();
   const { setQueryParams, removeQueryParams } = useQueryParams();

   ////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////// all functions from ProblemFilter //////////////////////////
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
         manageFiltersInUrl({
            type: "add",
            category,
            value,
         });
         setProblemSetLoading &&
            setProblemSetLoading({
               loading: true,
               value: category,
            }); // to make skeleton loading animation

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
                  setIsSelected((prev) => {
                     return { ...prev, [value]: true };
                  });
                  processFilters(filterValues, currentListProblems);
               })
               .catch((err) => {
                  throw err;
               }));
         removeFilterVisiblity(); // becuse on click the filter data is
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div className="w-full h-fit bg-backg2 p-4 rounded-md shadow-md mb-4">
         <h2 className="text-lg mb-3 font-baloo font-semibold text-seco1 ">
            {"Today's"} Topics
         </h2>
         <ul className="w-full h-auto  flex flex-wrap justify-stretch text-prim1 ">
            {dayTopics?.topics &&
               dayTopics?.topics?.map((topic) => {
                  return (
                     <li
                        key={topic.id}
                        onClick={() => catchFilter("topics", topic.name)}
                        className={`px-1 mr-1 mb-2 rounded-sm ${
                           isSelected[topic.name]
                              ? " bg-opacity-25 text-prim1 "
                              : "text-prim2 "
                        } flex bg-white bg-opacity-20 font-baloo text-sm  cursor-pointer hover:bg-opacity-25 hover:text-prim1 transform transition-all `}
                     >
                        {topic.name}
                        {isSelected[topic.name]}
                        {isSelected[topic.name] && (
                           <BsCheck2Circle className="text-easy mt-[2px] ml-1" />
                        )}
                     </li>
                  );
               })}
         </ul>
      </div>
   );
};

export default WeekDayTopics;
