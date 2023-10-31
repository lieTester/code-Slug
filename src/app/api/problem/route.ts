import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllProblems = async (req: NextRequest, res: NextResponse) => {
   try {
      const problems = await prisma.problem.findMany({
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
      });

      const transformedProblems = problems.map((problem) => ({
         ...problem,
         tags: problem.tags.map((tag) => tag.name),
         CompanyProblem: problem.CompanyProblem.map((cp) => cp.company.name),
         status: "todo",
      }));

      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

const updateUserProblemStatus = async (req: NextRequest, res: NextResponse) => {
   try {
      const { problemID, status, id } = await req.json();
      // to double check if the user id is correct
      const user = await prisma.user.findFirst({
         where: { email: id },
      });
      if (user) {
         const problemStatus = await prisma.problemStatus.findUnique({
            where: {
               UserProblemStatusUnique: {
                  problemId: problemID,
                  userId: user?.id,
               },
            },
         });
         if (problemStatus) {
            await prisma.problemStatus.update({
               where: {
                  UserProblemStatusUnique: {
                     problemId: problemID,
                     userId: user?.id,
                  },
               },
               data: { status: status },
            });
         } else {
            if (user) {
               await prisma.problemStatus.create({
                  data: {
                     status: status,
                     problemId: problemID,
                     userId: user?.id,
                  },
               });
            }
            return NextResponse.json({ status: 200 });
         }
      }
      return NextResponse.json({ status: 400 });
   } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, error });
   }
};
export { getAllProblems as GET, updateUserProblemStatus as POST };
