import ListLandingBodySkeleton from "@/components/skeleton/listlanding/ListLandingBodySkeleton";
import ListLandingSideBar from "./ListLandingSideBar";
import ListLandingProblemFilterSkeleton from "./ListLandingProblemFilterSkeleton";

const ListLandingSkeleton = () => {
   return (
      <section className="w-[95%] lg:w-[90%] 2xl:w-[80%] h-full  mx-auto flex pt-20 py-10  ">
         <ListLandingSideBar />
         <div className="relative h-full w-[60%] mx-auto lg:w-[70%] font-baloo ">
            <ListLandingProblemFilterSkeleton />
            <ListLandingBodySkeleton />
         </div>
      </section>
   );
};

export default ListLandingSkeleton;
