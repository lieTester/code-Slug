import React, { useEffect } from "react";
// functions
import { getAllLists, getSelectList } from "@/functions/ListFunctions";

function ListSideBar() {
   useEffect(() => {}, []);

   return (
      <ul className="w-full h-full md:w-[40%] lg:w-[30%]  bg-backg2 rounded-md"></ul>
   );
}

export default ListSideBar;