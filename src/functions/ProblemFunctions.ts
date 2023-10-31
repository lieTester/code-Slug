import React, { useEffect } from "react";
import { ProblemsProp } from "@/types/index";
import axios from "axios";
export const GetAllProblems = async (id: string | null) => {
   const response = await axios.get("/api/problem/", {
      method: "GET",
   });

   if (response.status !== 200) {
      throw new Error("Failed to fetch data");
   }

   let problemCollection: ProblemsProp[] = await response.data.data;
   if (id) {
      const res = await getUserProblemsStatus(id);

      if (res?.problemStatus) {
         problemCollection = problemCollection.map((problem) => {
            const item = res.problemStatus.find(
               (item: any) => item.id === problem.id
            );
            if (item) return { ...problem, status: item.status };
            return { ...problem, status: "todo" };
         });
         // console.log(problemCollection);
      }
   }

   return { problemCollection };
};

export const getUserProblemsStatus = async (id: string) => {
   if (id) {
      const response = await axios.get(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/${id}`
      );
      const problemStatus: any = response?.data?.problems.map(
         (problem: any) => {
            return {
               id: problem.problemId,
               status: problem.status,
               title: problem.problem.title,
               titleSlug: problem.problem.titleSlug,
            };
         }
      );
      // console.log(problemStatus);
      return { problemStatus };
   }
};

export const addUpdateProblemStatus = async (
   problemID: number,
   id: string,
   status: string
) => {
   if (id) {
      const response = await axios.post(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/`,
         { id, status, problemID }
      );

      return response;
   }
};
