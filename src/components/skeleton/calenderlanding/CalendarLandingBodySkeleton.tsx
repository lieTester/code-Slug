import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CalendarLandingBodyBaseSkeleton from "@/components/skeleton/calenderlanding/CalendarLandingBodyBaseSkeleton";
import CalendarWeeklyPlansBaseSkeleton from "@/components/skeleton/calenderlanding/CalendarWeeklyPlansBaseSkeleton";
import CalendarApplyWeeklyPlanBaseSkeleton from "@/components/skeleton/calenderlanding/CalendarApplyWeeklyPlanBaseSkeleton";

function CalendarLandingBodySkeleton() {
   const searchParams = useSearchParams();

   const [viewNavigation, setViewNavigation] = useState<string>("");

   const getMainNav = () => {
      switch (viewNavigation) {
         case "create-edit-weekly-plans":
            return <CalendarWeeklyPlansBaseSkeleton />;

         case "apply-weekly-plan":
            return <CalendarApplyWeeklyPlanBaseSkeleton />;
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
