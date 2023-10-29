import React from "react";
import axios from "axios";

export const getAllLists = async (email: string | null) => {
   // console.log(email);
   const res = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/lists/",
      { user: email }
   );
   return res;
};

export const getSelectList = async (listId: number) => {
   const res = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/lists/${listId}`
   );
   return res;
};
