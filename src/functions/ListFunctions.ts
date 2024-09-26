import React from "react";
import axios from "axios";
import { ProblemsProp } from "@/types/index";
import { getUserProblemsStatus } from "./ProblemFunctions";

export const getAllLists = async ({ userId }: { userId: string | null }) => {
   try {
      const response = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/lists/`,
         {
            params: { type: "getAllLists", userId },
         }
      );
      return response;
   } catch (error) {
      console.error("Failed to fetch topics:", error);
      throw error;
   }
};

export const getSelectList = async ({
   listId,
   userId,
}: {
   listId: string;
   userId: string | null;
}) => {
   try {
      const response = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/lists/`,
         {
            params: { type: "getProblemsInList", listId },
         }
      );

      if (response.status !== 200) {
         throw new Error("Failed to fetch data");
      }
      let currentList: ProblemsProp[] = await response.data.data;
      if (userId) {
         const res = await getUserProblemsStatus({ userId });

         if (res?.problemStatus) {
            currentList = currentList.map((problem) => {
               const item = res.problemStatus.find(
                  (item: any) => item.id === problem.id
               );
               if (item) return { ...problem, status: item.status };
               return { ...problem, status: "todo" };
            });
         }
      }

      return { currentList };
   } catch (error) {
      console.error("Failed to fetch problems of current list:", error);
      throw error;
   }
};

export const createNewList = async ({
   userId,
   listName,
   currentList,
}: {
   userId: string;
   listName: string;
   currentList: ProblemsProp[];
}) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/lists/`,
         {
            type: "createNewListForUser",
            userId,
            currentList,
            listName,
         }
      );
      return response;
   } catch (error) {
      console.error("Failed to create new list:", error);
      throw error;
   }
};

export const deleteList = async ({
   userId,
   listId,
}: {
   userId: string;
   listId: string;
}) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/lists/`,
         {
            type: "deleteListForUser",
            userId,
            listId,
         }
      );
      return response;
   } catch (error) {
      console.error("Failed to delete list:", error);
      throw error;
   }
};
export const updateListName = async ({
   userId,
   listId,
   listName,
}: {
   userId: string;
   listId: string;
   listName: string;
}) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/lists/`,
         {
            type: "updateUsersListName",
            userId,
            listName,
            listId,
         }
      );
      return response;
   } catch (error) {
      console.error("Failed to update list Name:", error);
      throw error;
   }
};
export const removeProblemFromList = async ({
   userId,
   listId,
   problemId,
}: {
   userId: string;
   listId: string;
   problemId: number;
}) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/lists/`,
         {
            type: "unlinkProblemFromList",
            userId,
            problemId,
            listId,
         }
      );
      return response;
   } catch (error) {
      console.error("Failed to remove problem from list:", error);
      throw error;
   }
};
