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
      const currentList = await prisma.list.findFirst({
         where: {
            id: listId,
         },
         include: {
            problems: {
               include: {
                  tags: {
                     select: {
                        name: true,
                     },
                  },
                  PlatformLinks: {
                     select: {
                        name: true,
                        link: true,
                     },
                  },
                  CompanyProblem: {
                     select: {
                        company: {
                           select: {
                              name: true,
                           },
                        },
                     },
                  },
               },
            },
         },
      });
      const transformedProblems = currentList?.problems?.map((problem) => ({
         ...problem,
         tags: problem.tags.map((tag) => tag.name),
         companies: problem.CompanyProblem.map((cp) => cp.company.name),
      }));
      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      // console.error(error);
      return NextResponse.json({ status: 500, params, error });
   }
};

export { getProblemsInList as GET };
