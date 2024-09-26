import React from "react";
import axios from "axios";

export const getAllCompanylist = async () => {
   try {
      const res = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/`,
         {
            params: { type: "getAllCompanies" },
         }
      );
      return res;
   } catch (error) {
      console.error("Failed to fetch topics:", error);
      return { error: "Failed to fetch topics" };
   }
};
