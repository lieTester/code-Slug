"use client";
import CalendarApplyWeeklyPlan from "@/components/calendarPageComponents/CalendarApplyWeeklyPlan";
import CalendarBase from "@/components/calendarPageComponents/CalendarBase";
import CalendarWeeklyPlans from "@/components/calendarPageComponents/CalendarWeeklyPlans";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function useRouterForCalendar<T = {}>() {
   const router = useRouter();
   // Array of components that represent different views
   const [currentIndex, setCurrentIndex] = useState<number>(0);
   const [viewNavigation, setViewNavigation] = useState<JSX.Element[]>([
      <CalendarBase key="" />,
      <CalendarApplyWeeklyPlan key="apply-weekly-plan" />,
      <CalendarWeeklyPlans key="create-edit-weekly-plans" />,
   ]);
   const sections = ["", "apply-weekly-plan", "create-edit-weekly-plans"];
   const updateURL = (index: number) => {
      const section = sections[index];
      router.push(`/calender-landing/${section}`, undefined);
   };
   return {
      router,
      sections,
      currentIndex,
      viewNavigation,
      updateURL,
      setCurrentIndex,
      setViewNavigation,
   };
}
