import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getUserProblemsStatus = async (
   req: NextRequest,
   { params }: { params: { user: string } }
) => {
   try {
      const user = await prisma.user.findUnique({
         where: { email: params.user },
      });
      console.log(params.user, user);
      // Fetch problems and related data
      const problems = await prisma.problem.findMany({
         where: {
            userProblemStatus: {
               some: {
                  userId: user?.id,
               },
            },
         },
         include: {
            userProblemStatus: {
               where: {
                  userId: user?.id,
               },
               select: {
                  status: true,
               },
            },
         },
      });
      return NextResponse.json({ status: 200, problems });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
export { getUserProblemsStatus as POST };
