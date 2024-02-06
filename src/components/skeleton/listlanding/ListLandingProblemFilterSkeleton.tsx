const ListLandingProblemFilterSkeleton = () => {
   return (
      <section className="min-h-[250px] md:min-h-[160px] lg:md:min-h-[120px] xl:min-h-[14%]">
         <ul className="w-full relative  flex justify-end flex-wrap [&>*]:flex [&>*]:mb-1 [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-gray-700 text-prim2 ">
            <li className="w-[76px] h-[32px] animate-pulse"></li>
            <li className="w-[108px] h-[32px] animate-pulse"></li>
            <li className="w-[88px] h-[32px] animate-pulse"></li>
            <li className="w-[75px] h-[32px] animate-pulse"></li>
            <li className="w-[197px] h-[32px] animate-pulse"></li>
         </ul>
      </section>
   );
};

export default ListLandingProblemFilterSkeleton;
