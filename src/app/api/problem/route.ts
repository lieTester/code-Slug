import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllProblems = async (req: NextRequest, res: NextResponse) => {
   try {
      const problems = await prisma.problem.findMany();
      return NextResponse.json({ status: 200, data: problems });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getAllProblems as GET };
