import React from "react";
import useQueryParams from "@/hook/useQueryParams";

interface PaginationProps {
   currentPage: number;
   totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
   const { setQueryParams } = useQueryParams();

   // Calculate the range of page numbers to display (5 pages)
   currentPage = Math.ceil(currentPage % (totalPages + 1));
   let pageRange = Array.from(
      { length: 5 },
      (_, index) => currentPage - 2 + index
   );

   // Ensure at least 5 pages in the pagination
   if (totalPages < 5) {
      pageRange = Array.from({ length: totalPages }, (_, index) => index + 1);
   } else if (currentPage < 3) {
      pageRange = Array.from({ length: 5 }, (_, index) => index + 1);
   } else if (currentPage > totalPages - 2) {
      pageRange = Array.from({ length: 5 }, (_, index) =>
         Math.floor(totalPages - 4 + index)
      );
   }

   const onPageChange = (pageNumber: number) => {
      const query: any = { pageno: pageNumber };
      setQueryParams(query);
   };

   return (
      <div className="">
         {currentPage > 1 && (
            <button
               className="px-3 py-1 mx-2 rounded-md text-prim1 bg-secod1"
               onClick={() => onPageChange(currentPage - 1)}
            >
               Prev
            </button>
         )}

         {pageRange.map((pageNumber) => {
            if (pageNumber > 0 && pageNumber <= totalPages) {
               return (
                  <button
                     key={pageNumber}
                     onClick={() => onPageChange(pageNumber)}
                     className={`w-7 h-7 mx-2 rounded-md  ${
                        pageNumber === currentPage
                           ? "bg-secod1 text-prim1"
                           : " hidden md:inline bg-front2 text-prim2"
                     }`}
                  >
                     {pageNumber}
                  </button>
               );
            }
            return null;
         })}

         {currentPage < totalPages && (
            <button
               className="px-3 py-1 ml-2 rounded-md text-prim1 bg-secod1"
               onClick={() => onPageChange(currentPage + 1)}
            >
               Next
            </button>
         )}
      </div>
   );
};

export default Pagination;
