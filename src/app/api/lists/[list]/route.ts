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
      const problemsInList = await prisma.list.findFirst({
         where: {
            id: listId,
         },
         include: {
            problems: true,
         },
      });
      return NextResponse.json({ status: 200, data: problemsInList });
   } catch (error) {
      // console.error(error);
      return NextResponse.json({ status: 500, params, error });
   }
};

export { getProblemsInList as GET };
