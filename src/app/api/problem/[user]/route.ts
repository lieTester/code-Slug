import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getUserProblemsStatus = async (
   req: NextRequest,
   { params }: { params: { user: string } }
) => {
   try {
      const user = await prisma.user.findUnique({
         where: { id: params.user },
      });
      // console.log(params.user, user);
      // Fetch problems and related data
      if (user) {
         const problems = await prisma.problemStatus.findMany({
            where: {
               user: {
                  id: user?.id,
               },
            },
            select: {
               problemId: true,
               status: true,
               problem: {
                  select: {
                     title: true,
                     titleSlug: true,
                  },
               },
            },
         });

         return NextResponse.json({ status: 200, problems });
      }
      return NextResponse.json({ status: 405, msg: "don't try" });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
export { getUserProblemsStatus as GET };
