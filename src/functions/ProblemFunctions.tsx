import React, { useEffect } from "react";
import { ProblemsProp } from "@/types/index";

export const GetAllProblems = async ({
   setAllProblems,
   setPage,
   page,
}: {
   setAllProblems: (problems: ProblemsProp[]) => void;
   setPage: (page: any) => void;
   page: any;
}) => {
   await fetch("/api/problem/", {
      method: "GET",
   }).then((response: any) => {
      response.json().then((data: any) => {
         // console.log(data);
         if (setAllProblems && setPage) {
            setAllProblems(data.data);
            setPage((prev: any) => {
               return {
                  ...prev,
                  totalPages: data.data.length / page.pageSize,
               };
            });
         }
      });
   });
};

export const getLists = async () => {};
