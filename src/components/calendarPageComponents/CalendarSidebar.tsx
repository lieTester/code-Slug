import React, { useEffect, useRef } from "react";
import Image from "next/image";
import useQueryParams from "@/hook/useQueryParams";
import { useSearchParams } from "next/navigation";

const CalederSidebar: React.FC = () => {
   //
   const { setQueryParams } = useQueryParams();

   // Explicitly set the ref type to HTMLDivElement
   const parentRef = useRef<HTMLDivElement>(null);
   const childRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleResize = () => {
         if (parentRef.current && childRef.current) {
            const parentWidth = parentRef.current.offsetWidth;
            const parentHeight = parentRef.current.offsetHeight;
            childRef.current.style.width = `${parentWidth}px `;
            childRef.current.style.height = `${parentHeight}px `;
         }
      };
      // Set the initial width on mount
      handleResize();
      // Add event listener for window resize to update width
      window.addEventListener("resize", handleResize);
      // Cleanup function to remove the event listener
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []); // Empty dependency array ensures this runs only on mount and unmount

   return (
      <section
         className="relative w-full md:h-full md:w-[40%] lg:w-[30%] 2xl:w-[25%] mr-[10px] text-prim1 mb-4 "
         ref={parentRef}
      >
         <div
            className="relative md:fixed w-full [&>*]:mb-2 [&>*]:pb-2 "
            ref={childRef}
         >
            <ul
               className="relative w-[100%]  rounded-md overflow-hidden "
               id="highlight1"
            >
               <li className="absolute w-full h-full z-1">
                  <Image
                     className="w-full h-full"
                     src={"/img/bg1.jpg"}
                     alt="logo-img"
                     width={"1674"}
                     height={"980"}
                  />
               </li>
               <ul className="relative w-full  z-2 p-2 pt-5 ">
                  <li className="text-xl">Calender Submits :</li>
                  <li className="text-sm font-thin text-prim2 ">
                     All solved and attemptes
                  </li>
                  <button
                     onClick={() => setQueryParams({ block: "" })}
                     className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto cursor-pointer transition-transform duration-100 hover:scale-110 "
                  >
                     Check out
                  </button>
               </ul>
            </ul>
            <ul
               className="relative w-full  rounded-md overflow-hidden"
               id="highlight1"
            >
               <li className="absolute w-full z-1">
                  <Image
                     className="w-full h-full"
                     src={"/img/bg3.jpg"}
                     alt="logo-img"
                     width={"1674"}
                     height={"980"}
                  />
               </li>
               <ul className="relative w-full z-2 p-2 pt-5 ">
                  <li className="text-xl">Select a weekly plan :</li>
                  <li className="text-sm font-thin text-prim2 mt-1">
                     Aplly plan to timely practice Data & Structure
                  </li>
                  <button
                     onClick={() =>
                        setQueryParams({ block: "create-edit-weekcalendar" })
                     }
                     className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto cursor-pointer transition-transform duration-100 hover:scale-110 "
                  >
                     Check out
                  </button>
               </ul>
            </ul>
            <ul
               className="relative w-full  rounded-md overflow-hidden"
               id="highlight1"
            >
               <li className="absolute w-full  z-1">
                  <Image
                     className="w-full h-full"
                     src={"/img/bg6.jpg"}
                     alt="logo-img"
                     width={"1674"}
                     height={"980"}
                  />
               </li>
               <ul className="relative w-full  z-2 p-2 pt-5 ">
                  <li className="text-xl">Create & Edit week plans : </li>
                  <li className="text-sm font-thin text-prim2 ">
                     Set your weekly plans to consistently solve every Data &
                     Structure
                  </li>
                  <button
                     onClick={() => setQueryParams({ block: "weekly-plan" })}
                     className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto cursor-pointer transition-transform duration-100 hover:scale-110 "
                  >
                     Check out
                  </button>
               </ul>
            </ul>
         </div>
      </section>
   );
};

export default CalederSidebar;
