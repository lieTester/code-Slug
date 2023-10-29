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
      }));

      return NextResponse.json({ status: 200, data: transformedProblems });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getAllProblems as GET };
