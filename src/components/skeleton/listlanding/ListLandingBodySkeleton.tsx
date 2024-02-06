import ListLandingBaseListHolderSkeleton from "@/components/skeleton/listlanding/ListLandingBaseListHolderSkeleton";
import ListLandingNewListCreaterSkeleton from "@/components/skeleton/listlanding/ListLandingNewListCreaterSkeleton";

const ListLandingBodySkeleton = () => {
   return (
      <div className="relative h-[86%] pl-2">
         <ListLandingBaseListHolderSkeleton />
         <ListLandingNewListCreaterSkeleton />
      </div>
   );
};

export default ListLandingBodySkeleton;
