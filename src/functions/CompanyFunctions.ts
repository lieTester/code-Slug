import React from "react";
import axios from "axios";

export const getAllCompanylist = async () => {
   // console.log(email);
   const res = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/companies/"
   );
   return res;
};
