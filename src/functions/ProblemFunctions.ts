import { ProblemsProp } from "@/types/index";
import axios from "axios";
export const GetAllProblems = async ({ userId }: { userId: string | null }) => {
   const response = await axios.get("/api/problem/", {
      method: "GET",
   });

   if (response.status !== 200) {
      throw new Error("Failed to fetch data");
   }

   let problemCollection: ProblemsProp[] = await response.data.data;
   if (userId) {
      const res = await getUserProblemsStatus({ userId });

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

export const getUserProblemsStatus = async ({ userId }: { userId: string }) => {
   if (userId) {
      const response = await axios.get(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/${userId}`
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

export const addUpdateProblemStatus = async ({
   problemID,
   userId,
   status,
}: {
   problemID: number;
   userId: string;
   status: string;
}) => {
   if (userId) {
      const response = await axios.post(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/`,
         { type: "updateUserProblemStatus", userId, status, problemID }
      );

      return response;
   }
};
export const fetchUserProblemStatuses = async ({
   userId,
   year,
   month,
}: {
   userId: string;
   year: number;
   month: number;
}) => {
   try {
      const response = await axios.post(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/`,
         { type: "fetchUserProblemStatusForMonth", userId, year, month }
      );

      return response.data;
   } catch (error) {
      return {
         msg: "fetchUserProblemStatuses failed in problemfunctions",
         error,
      };
   }
};
