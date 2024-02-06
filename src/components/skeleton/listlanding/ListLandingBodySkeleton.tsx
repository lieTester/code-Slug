import ListLandingBaseListHolderSkeleton from "@/components/skeleton/listlanding/ListLandingBaseListHolderSkeleton";
import ListLandingNewListCreaterSkeleton from "@/components/skeleton/listlanding/ListLandingNewListCreaterSkeleton";

const ListLandingBodySkeleton = () => {
   return (
      <div className="relative h-[calc(100%-250px)] md:h-[calc(100%-160px)] lg:h-[calc(100%-120px)] xl:h-[86%] pl-2">
         <ListLandingBaseListHolderSkeleton />
         <ListLandingNewListCreaterSkeleton />
      </div>
   );
};

export default ListLandingBodySkeleton;
