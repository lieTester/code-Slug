import React from "react";
import axios from "axios";
import { ProblemsProp } from "@/types/index";
import { getUserProblemsStatus } from "./ProblemFunctions";

export const getAllLists = async ({ userId }: { userId: string | null }) => {
   // console.log(id);
   const res = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/lists/",
      { user: userId }
   );
   return res;
};

export const getSelectList = async ({
   listId,
   userId,
}: {
   listId: string;
   userId: string | null;
}) => {
   const response = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listId}`
   );

   if (response.status !== 200) {
      throw new Error("Failed to fetch data");
   }
   let currentList: ProblemsProp[] = await response.data.data;
   if (userId) {
      const res = await getUserProblemsStatus(userId);

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
         process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listName}`,
         { type: "createNewListForUser", user: userId, currentList }
      );
      return response;
   } catch (error) {
      return error;
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
         process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listId}`,
         { type: "deleteListForUser", user: userId }
      );
      return response;
   } catch (error) {
      return error;
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
         process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listId}`,
         { type: "updateUsersListName", user: userId, listName }
      );
      return response;
   } catch (error) {
      return error;
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
         process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listId}`,
         { type: "unlinkProblemFromList", user: userId, problemId }
      );
      return response;
   } catch (error) {
      return error;
   }
};
