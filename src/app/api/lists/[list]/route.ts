// pages/api/lists/[listId]/problems.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib";

const getProblemsInList = async (
   req: NextRequest,
   { params }: { params: { list: string } }
) => {
   console.log(params);

   try {
      const listId = params.list;
      const problemsInList = await prisma.list.findUnique({
         where: {
            id: Number(listId),
         },
         include: {
            problems: {
               include: {
                  userProblemStatus: true,
               },
            },
         },
      });
      return NextResponse.json({ status: 200, data: problemsInList });
   } catch (error) {
      // console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getProblemsInList as GET };
