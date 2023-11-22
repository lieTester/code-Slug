import ListLandingBodySkeleton from "@/components/skeleton/listlanding/ListLandingBodySkeleton";
import ListLandingProblemFilterSkeleton from "@/components/skeleton/listlanding/ListLandingProblemFilterSkeleton";

const ListLandingSkeleton = () => {
   return (
      <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] h-[95%]  mx-auto pt-20 pb-20 ">
         <ListLandingProblemFilterSkeleton />
         <ListLandingBodySkeleton />
      </div>
   );
};

export default ListLandingSkeleton;
