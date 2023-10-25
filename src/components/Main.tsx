import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io"; // Import your desired filter icon
import ProblemTable from "@/components/subcomponent/Problems";

const Main = () => {
   return (
      <section className="relative w-full overflow-hidden lg:w-[70%] 2xl:w-[75%] font-sofiaPro">
         <ul className=" relative [&>*]:flex [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-seco2 text-prim2 flex justify-end">
            <li className="">
               Lists <IoMdArrowDropdown className="ml-3" />
            </li>
            <li>
               Dificulty <IoMdArrowDropdown className="ml-3" />
            </li>
            <li>
               Status <IoMdArrowDropdown className="ml-3" />
            </li>
            <li>
               Tags <IoMdArrowDropdown className="ml-3" />
            </li>
            <li>
               <IoMdSearch className="mr-3" />
               <input
                  className="bg-transparent outline-none"
                  placeholder="Search problem..."
                  type="text"
               />
            </li>
            <li>Pick One</li>
         </ul>
         <ProblemTable />
      </section>
   );
};

export default Main;
