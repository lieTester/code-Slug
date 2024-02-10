import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const getAllTopics = async (req: NextRequest, res: NextResponse) => {
   try {
      const topics = await prisma.topic.findMany();
      return NextResponse.json({ status: 200, topics });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

export { getAllTopics as GET };
