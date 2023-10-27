import React, { useEffect, useState, useContext } from "react";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io"; // Import your desired filter icon
import axios from "axios";
import { SessionContext } from "@/context/SessionContext";
import { getAllLists } from "@/functions/ListFunctions";
const Filters = () => {
   const sessionContext = useContext(SessionContext);
   const session = sessionContext?.session;

   const [lists, setLists] = useState<any[]>();
   const [companies, setCompanies] = useState<any[]>();

   useEffect(() => {
      // console.log(session?.user);

      console.log(session);
      if (session !== undefined) {
         getAllLists(session?.user?.email).then((res: any) => {
            console.log(res.data.lists);
            setLists(res.data.lists);
         });
      }
   }, [session]);

   return (
      <ul className=" relative [&>*]:flex [&>*]:items-center [&>*]:ml-3 [&>*]:py-1 [&>*]:px-2 [&>*]:rounded-md [&>*]:bg-seco2 text-prim2 flex justify-end">
         <li className="relative cursor-pointer z-50 group" tabIndex={0}>
            Lists
            <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
            <ul className="absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md  -translate-y-2 invisible  bg-seco2 group-focus:visible group-focus:opacity-100 group-focus:translate-y-0 transition-[opacity,transform]">
               {lists &&
                  lists.map(({ id, name, slug }) => {
                     return (
                        <li
                           className="truncate hover:bg-extra1 mt-1 rounded-sm px-1"
                           key={id}
                        >
                           {name}
                        </li>
                     );
                  })}
            </ul>
         </li>
         <li className="relative cursor-pointer z-50 group" tabIndex={0}>
            Dificulty
            <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
            <ul className="absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md  -translate-y-2 invisible  bg-seco2 group-focus:visible group-focus:opacity-100 group-focus:translate-y-0 transition-[opacity,transform]">
               {lists &&
                  lists.map(({ id, name, slug }) => {
                     return (
                        <li
                           className="truncate hover:bg-extra1 mt-1 rounded-sm px-1"
                           key={id}
                        >
                           {name}
                        </li>
                     );
                  })}
            </ul>
         </li>
         <li className="relative cursor-pointer z-50 group" tabIndex={0}>
            Status
            <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
            <ul className="absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md  -translate-y-2 invisible  bg-seco2 group-focus:visible group-focus:opacity-100 group-focus:translate-y-0 transition-[opacity,transform]">
               {lists &&
                  lists.map(({ id, name, slug }) => {
                     return (
                        <li
                           className="truncate hover:bg-extra1 mt-1 rounded-sm px-1"
                           key={id}
                        >
                           {name}
                        </li>
                     );
                  })}
            </ul>
         </li>
         <li className="relative cursor-pointer z-50 group" tabIndex={0}>
            Tags
            <IoMdArrowDropdown className="ml-3 hover:cursor-pointer group-focus:rotate-180 transition-[transform] ease-linear" />
            <ul className="absolute top-10 left-0 w-[200px] max-w-xl py-2 px-3 rounded-md  -translate-y-2 invisible  bg-seco2 group-focus:visible group-focus:opacity-100 group-focus:translate-y-0 transition-[opacity,transform]">
               {lists &&
                  lists.map(({ id, name, slug }) => {
                     return (
                        <li
                           className="truncate hover:bg-extra1 mt-1 rounded-sm px-1"
                           key={id}
                        >
                           {name}
                        </li>
                     );
                  })}
            </ul>
         </li>

         <li className="w-40 focus-within:w-60 transition-all duration-500">
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
