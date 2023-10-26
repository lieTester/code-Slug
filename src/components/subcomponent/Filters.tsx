import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io"; // Import your desired filter icon

const Filters = () => {
   const [lists, setLists] = useState<any[]>();
   const [companies, setCompanies] = useState<any[]>();

   return (
      <ul className=" relative [&>*]:flex [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-seco2 text-prim2 flex justify-end">
         <li className="">
            Lists <IoMdArrowDropdown className="ml-3" />
            <div className="absolute"></div>
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
      </ul>
   );
};

export default Filters;
