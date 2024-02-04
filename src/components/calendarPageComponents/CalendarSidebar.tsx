import React from "react";
import Image from "next/image";

function calederSidebar() {
   return (
      <section className="w-full h-full md:w-[40%] lg:w-[30%] xl:w-[25%]  mr-2 text-prim1  mb-4 ">
         <div className="w-full [&>*]:bg-backg2 font-sofiaPro [&>*]:mb-2 [&>*]:pb-2 [&>*]:cursor-pointer">
            <ul
               className="relative w-[100%] h-full rounded-md overflow-hidden "
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
               <ul className="relative w-full h-full z-2 p-2 pt-5 ">
                  <li className="text-xl">Calender Submits :</li>
                  <li className="text-sm font-thin text-prim2 ">
                     All solved and attemptes
                  </li>
                  <li className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto">
                     Check out
                  </li>
               </ul>
            </ul>
            <ul
               className="relative w-full h-full rounded-md overflow-hidden"
               id="highlight1"
            >
               <li className="absolute w-full h-full z-1">
                  <Image
                     className="w-full h-full"
                     src={"/img/bg6.jpg"}
                     alt="logo-img"
                     width={"1674"}
                     height={"980"}
                  />
               </li>
               <ul className="relative w-full h-full z-2 p-2 pt-5 ">
                  <li className="text-xl">Create & Edit week plans : </li>
                  <li className="text-sm font-thin text-prim2 ">
                     Set your weekly plans to consistently solve every Data &
                     Structure
                  </li>
                  <li className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto">
                     Check out
                  </li>
               </ul>
            </ul>
            <ul
               className="relative w-full h-full rounded-md overflow-hidden"
               id="highlight1"
            >
               <li className="absolute w-full h-full z-1">
                  <Image
                     className="w-full h-full"
                     src={"/img/bg3.jpg"}
                     alt="logo-img"
                     width={"1674"}
                     height={"980"}
                  />
               </li>
               <ul className="relative w-full h-full z-2 p-2 pt-5 ">
                  <li className="text-xl">Select a weekly plan :</li>
                  <li className="text-sm font-thin text-prim2 mt-1">
                     Aplly plan to timely practice Data & Structure
                  </li>
                  <li className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto">
                     Check out
                  </li>
               </ul>
            </ul>
            <ul
               className="relative w-full h-full rounded-md overflow-hidden"
               id="highlight1"
            >
               <li className="absolute w-full h-full z-1">
                  <Image
                     className="w-full h-full"
                     src={"/img/bg7.jpg"}
                     alt="logo-img"
                     width={"1674"}
                     height={"980"}
                  />
               </li>
               <ul className="relative w-full h-full z-2 p-2 pt-5 ">
                  <li className="text-xl">Calender Submits :</li>
                  <li className="text-sm font-thin text-prim2 mt-1">
                     All solved and attemptes
                  </li>
                  <li className="relative text-sm font-thin  mt-3 bg-white text-secod2 inline-block p-1 rounded-md  !mr-auto">
                     Check out
                  </li>
               </ul>
            </ul>
         </div>
      </section>
   );
}

export default calederSidebar;
