import React from "react";
import axios from "axios";
import { ProblemsProp } from "@/types/index";
import { getUserProblemsStatus } from "./ProblemFunctions";

export const getAllLists = async (id: string | null) => {
   // console.log(id);
   const res = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/lists/",
      { user: id }
   );
   return res;
};

export const getSelectList = async (listId: number, id: string | null) => {
   const response = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listId}`
   );

   if (response.status !== 200) {
      throw new Error("Failed to fetch data");
   }
   let currentList: ProblemsProp[] = await response.data.data;
   if (id) {
      const res = await getUserProblemsStatus(id);

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
   id,
   listName,
   currentList,
}: {
   id: string;
   listName: string;
   currentList: ProblemsProp[];
}) => {
   try {
      const response = await axios.post(
         process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listName}`,
         { user: id, currentList }
      );
      return response;
   } catch (error) {
      return error;
   }
};
