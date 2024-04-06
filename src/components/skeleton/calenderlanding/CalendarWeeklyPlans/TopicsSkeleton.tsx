import React from "react";

const TopicsSkeleton: React.FC<{ count?: number; topicHeight?: string }> = ({
   count,
   topicHeight,
}) => {
   const length: string[] = ["w-16", "w-20", "w-[60px]", "w-24"];
   return (
      <ul className="max-h-[calc(100%-50px)] flex flex-wrap justify-evenly mt-2 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-backg1 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-front2">
         {/* Render a skeleton loader with pulse animation */}
         {[...Array(count || 14)].map((_, index) => (
            <li
               key={index}
               className={`px-1 mr-1 mb-2 ${length[Math.floor(index / 4)]}  ${
                  topicHeight || "h-5"
               } bg-gray-700 animate-pulse rounded-md flex  text-sm cursor-pointer hover:bg-opacity-25 hover:text-prim1 transform transition-all`}
            />
         ))}
      </ul>
   );
};

export default TopicsSkeleton;
