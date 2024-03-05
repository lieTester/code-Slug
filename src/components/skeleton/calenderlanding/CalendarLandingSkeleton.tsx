import React from "react";
import CalendarLandingSideBarSkeleton from "@/components/skeleton/calenderlanding/CalendarLandingSideBar";
import CalendarLandingBodySkeleton from "./CalendarLandingBodySkeleton";

function CalendarLandingSkeleton() {
   return (
      <section className="w-screen min-h-screen h-full pt-20 py-10  overflow-y-auto">
         <div className="w-[95%] h-full lg:w-[90%] 2xl:w-[80%] md:flex justify-between mx-auto font-baloo">
            <CalendarLandingSideBarSkeleton />
            <CalendarLandingBodySkeleton />
         </div>
      </section>
   );
}

export default CalendarLandingSkeleton;
