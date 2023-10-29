import React, { useEffect } from "react";
import { ProblemsProp } from "@/types/index";
import axios from "axios";
export const GetAllProblems = async (email: string | null) => {
   if (email) {
      const response = await axios.post(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/${email}`
      );

      console.log(response?.data?.problems);
   }

   const response = await fetch("/api/problem/", {
      method: "GET",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch data");
   }
   const data = await response.json();
   const problemCollection: ProblemsProp[] = data.data;

   return { problemCollection };
};

export const getLists = async () => {};
