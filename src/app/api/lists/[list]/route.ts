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
      const transformedProblems = currentList?.problems?.map((problem) => {
         // Destructure the 'CompanyProblem' field to remove it
         const { CompanyProblem, ...rest } = problem;

         return {
            ...rest,
            status: "todo",
            tags: problem.tags.map((tag) => tag.name),
            companies: problem.CompanyProblem.map((cp) => cp.company.name),
         };
      });
      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      // console.error(error);
      return NextResponse.json({ status: 500, params, error });
   }
};

const createNewListForUser = async (
   req: NextRequest,
   { params }: { params: { list: string } }
) => {
   try {
      const { user, currentList } = await req.json();
      const isUser = await prisma.user.findUnique({ where: { id: user } });
      if (isUser) {
         const newList = await prisma.list.create({
            data: {
               name: params.list,
               slug: params.list.toLowerCase().replace(/ /g, "-"),
               isPublic: false,
               userId: user,
            },
         });
         if (newList) {
            // Now, iterate through the problem URLs and connect them to the list
            for (const problem of currentList) {
               // Extract the problem slug from the URL (you may need to adjust this based on your schema)

               // Connect the problem to the list
               // Check if the problem is not already connected to the list
               const isProblemInList = await prisma.list.findFirst({
                  where: {
                     id: newList.id,
                     problems: { some: { id: problem.id } },
                  },
               });

               if (!isProblemInList) {
                  // Connect the problem to the list
                  await prisma.list.update({
                     where: { id: newList.id },
                     data: {
                        problems: {
                           connect: { id: problem.id },
                        },
                     },
                  });
               }
            }
         }
      }
      return NextResponse.json({ status: 200, msg: "successfully created" });
   } catch (error) {
      return NextResponse.json({ status: 500, params, error });
   }
};

export { getProblemsInList as GET, createNewListForUser as POST };
