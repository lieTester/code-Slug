import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getUserProblemsStatus = async (
   req: NextRequest,
   { params }: { params: { user: string } }
) => {
   try {
      // Fetch user by ID
      const user = await prisma.user.findUnique({
         where: { id: params.user },
      });

      // Check if user exists
      if (!user) {
         return NextResponse.json({
            status: 404,
            message: "User not found",
         });
      }

      // Fetch problems and related data
      const problems = await prisma.problemStatus.findMany({
         where: {
            userId: user.id,
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
   } catch (error) {
      console.error("Error fetching user problem status:", error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};

export { getUserProblemsStatus as GET };
