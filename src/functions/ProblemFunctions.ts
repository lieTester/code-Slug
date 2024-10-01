import { ProblemsProp } from "@/types/index";
import axios from "axios";
export const GetAllProblems = async ({ userId }: { userId: string | null }) => {
   try {
      const response = await axios.get(
         ` ${process.env.NEXT_PUBLIC_API_BASE_URL}/problem/`,
         {
            params: { type: "getAllProblems" },
         }
      );

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
               if (item)
                  return {
                     ...problem,
                     status: item.status,
                     isLiked: item.like,
                  };
               return { ...problem, status: "todo" };
            });
         }
      }

      return { problemCollection };
   } catch (error) {
      console.error("Failed to fetch problems:", error);
      throw error;
   }
};

export const getUserProblemsStatus = async ({ userId }: { userId: string }) => {
   try {
      const response = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/problem/`,
         {
            params: { type: "getUserProblemsStatus", userId },
         }
      );
      const problemStatus: any = response?.data?.problems.map(
         (problem: any) => {
            return {
               id: problem.problemId,
               like: problem.like,
               status: problem.status,
               title: problem.problem.title,
               titleSlug: problem.problem.titleSlug,
            };
         }
      );
      return { problemStatus };
   } catch (error) {
      console.error("Failed to fetch problems status", error);
      throw error;
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
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/problem/`,
         {
            type: "updateUserProblemStatus",
            userId,
            status,
            problemID,
         }
      );

      if (response.status !== 200) {
         throw new Error("Failed to update problem status");
      }

      return response.data;
   } catch (error) {
      console.error("Failed to update problem status:", error);
      return { error: "Failed to update problem status" };
   }
};
export const updateUserProblemLikeDislike = async ({
   problemID,
   userId,
   isLiked,
}: {
   problemID: number;
   userId: string;
   isLiked: boolean;
}) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/problem/`,
         {
            type: "updateUserProblemLikeDislike",
            userId,
            isLiked,
            problemID,
         }
      );

      if (response.status !== 200) {
         throw new Error("Failed to update problem status");
      }

      return response.data;
   } catch (error) {
      console.error("Failed to update problem status:", error);
      return { error: "Failed to update problem status" };
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
      // Get the current client date and timezone offset
      const currentDate = new Date();
      const clientDate = currentDate.toISOString(); // Format the date as ISO string
      const timezoneOffset = currentDate.getTimezoneOffset(); // Get timezone offset in minutes

      // Send the request with the computed date and timezone
      const response = await axios.get(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/problem/`,
         {
            params: {
               type: "fetchUserProblemStatusForMonth",
               userId,
               year,
               month,
               clientDate, // Include the computed client date
               timezoneOffset, // Include the computed timezone offset
            },
         }
      );

      return response.data;
   } catch (error) {
      console.error(
         "fetchUserProblemStatuses failed in problemfunctions:",
         error
      );

      return {
         error: "fetchUserProblemStatuses failed in problemfunctions",
      };
   }
};
