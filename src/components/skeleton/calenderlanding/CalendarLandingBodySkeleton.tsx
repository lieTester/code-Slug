import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CalendarLandingBodyBaseSkeleton from "@/components/skeleton/calenderlanding/CalendarLandingBodyBaseSkeleton";
import CalendarWeeklyPlansBaseSkeleton from "./CalendarWeeklyPlansBaseSkeleton";

function CalendarLandingBodySkeleton() {
   const searchParams = useSearchParams();

   const [viewNavigation, setViewNavigation] = useState<string>("");

   const getMainNav = () => {
      switch (viewNavigation) {
         case "weekly-plan":
            return <CalendarWeeklyPlansBaseSkeleton />;
         default:
            return <CalendarLandingBodyBaseSkeleton />;
      }
   };
   useEffect(() => {
      setViewNavigation(searchParams?.get("block") || "");
   }, [searchParams?.get("block")]);
   return <>{getMainNav()}</>;
}

export default CalendarLandingBodySkeleton;
