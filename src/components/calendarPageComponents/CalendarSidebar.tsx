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
            childRef.current.style.width = `${parentWidth}px `;

            if (childRef.current) {
               // Check window size and toggle the 'fixed' class
               if (window.innerWidth >= 688) {
                  childRef.current.classList.add("md:fixed");
               } else {
                  childRef.current.classList.remove("md:fixed");
               }
            }
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
         className="relative w-full mb-4 md:h-full md:w-[40%] lg:w-[30%] 2xl:w-[25%]  text-prim1  "
         ref={parentRef}
      >
         <div
            className="  pb-6  w-full [&>*]:mb-2 [&>*]:h-fit  [&>*]:pb-2 "
            ref={childRef}
         >
            <ul
               className="relative w-[100%] h-fit rounded-md !overflow-hidden "
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
                        setQueryParams({ block: "apply-weekly-plan" })
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
                     onClick={() =>
                        setQueryParams({
                           block: "create-edit-weekly-plans",
                        })
                     }
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
