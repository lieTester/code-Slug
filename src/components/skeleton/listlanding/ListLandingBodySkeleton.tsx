import ListLandingBaseListHolderSkeleton from "@/components/skeleton/listlanding/ListLandingBaseListHolderSkeleton";
import ListLandingNewListCreaterSkeleton from "@/components/skeleton/listlanding/ListLandingNewListCreaterSkeleton";

const ListLandingBodySkeleton = () => {
   return (
      <section className="w-full overflow-hidden flex h-[95%]">
         <ListLandingBaseListHolderSkeleton />
         <ListLandingNewListCreaterSkeleton />
      </section>
   );
};

export default ListLandingBodySkeleton;
