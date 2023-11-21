import React from "react";
import ListLandingBody from "@/pages/skeleton/ListLandingSub/ListLandingBody";
const ListLandingSkeleton = () => {
   return (
      <div className="w-[95%] lg:w-[90%] 2xl:w-[80%] h-[100%] mx-auto pt-20 pb-20 ">
         <section className="w-full mb-4">
            <ul className="w-full relative  flex justify-end flex-wrap [&>*]:flex [&>*]:mb-1 [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-gray-700 text-prim2 ">
               <li className="w-[76px] h-[32px] animate-pulse"></li>
               <li className="w-[108px] h-[32px] animate-pulse"></li>
               <li className="w-[88px] h-[32px] animate-pulse"></li>
               <li className="w-[75px] h-[32px] animate-pulse"></li>
               <li className="w-[197px] h-[32px] animate-pulse"></li>
            </ul>
         </section>
         <ListLandingBody />
      </div>
   );
};

export default ListLandingSkeleton;
