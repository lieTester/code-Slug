import React from "react";
import { calculateVisibleTagsCount } from "@/functions/CalculateVisiblity";

function TruncateTags({
   tags,
   maxWidth,
   ulCss,
   liCss,
}: {
   tags: string[];
   maxWidth: number;
   ulCss: string;
   liCss: string;
}) {
   const { visibleCount, remainingCount } = calculateVisibleTagsCount(
      tags,
      maxWidth
   );

   return (
      <ul className={ulCss}>
         {tags.slice(0, visibleCount).map((tag, index) => {
            return (
               <li key={index} className={liCss}>
                  {tag}
               </li>
            );
         })}
         {remainingCount > 0 && (
            <li className="relative rounded-full bg-extra1 text-xs inline mx-[2px] px-1">
               +{remainingCount}
            </li>
         )}
      </ul>
   );
}

export default TruncateTags;
